import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { UserModel } from "../models/User.model.js";
import { OtpService } from "../models/Otp.model.js";
import { sendOtpEmail } from "../utils/mailer.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Step 1: Send a randomly generated 4-digit OTP to user's email
 */
export async function sendRegistrationOtp(req, res, next) {
  try {
    const { email, name } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name (minimum 2 characters).",
      });
    }

    // Check if account already exists
    const existingUser = await UserModel.findByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please sign in.",
      });
    }

    // Generate randomly generated 4-digit numeric OTP (1000 - 9999)
    const otpNumber = crypto.randomInt(1000, 10000);
    const otp = String(otpNumber);

    // Save hashed OTP in MongoDB with 5-minute expiry
    await OtpService.createOtp(cleanEmail, name.trim(), otp);

    // Send the OTP via Nodemailer SMTP
    try {
      await sendOtpEmail(cleanEmail, name.trim(), otp);
    } catch (mailErr) {
      console.error("[OTP Mail Dispatch Error]:", mailErr.message);
      await OtpService.deleteOtp(cleanEmail);
      return res.status(502).json({
        success: false,
        message: `Failed to dispatch OTP email (${mailErr.message}). Please verify SMTP settings.`,
      });
    }

    return res.json({
      success: true,
      message: "A 4-digit verification code has been dispatched to your email address.",
      email: cleanEmail,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Step 2: Verify the 4-digit OTP before allowing password creation
 */
export async function verifyRegistrationOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 4-digit OTP are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    if (!/^\d{4}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be exactly 4 digits.",
      });
    }

    const verificationResult = await OtpService.verifyOtp(cleanEmail, cleanOtp);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        code: verificationResult.code || "INVALID_OTP",
        message: verificationResult.message,
      });
    }

    return res.json({
      success: true,
      message: verificationResult.message,
      verificationToken: verificationResult.verificationToken,
      email: cleanEmail,
      name: verificationResult.name,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Step 3: Complete registration and persist user to MongoDB
 */
export async function completeRegistration(req, res, next) {
  try {
    const { email, name, password, confirmPassword, verificationToken } = req.body;

    if (!email || !password || !verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and verification token are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and password confirmation do not match.",
      });
    }

    // Verify and consume the single-use verification token
    const tokenVerification = await OtpService.consumeVerificationToken(cleanEmail, verificationToken);
    if (!tokenVerification.valid) {
      return res.status(400).json({
        success: false,
        message: "Verification session expired or invalid. Please verify your OTP again.",
      });
    }

    // Double check email isn't already registered
    const existingUser = await UserModel.findByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address is already registered.",
      });
    }

    // Hash password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const userName = name?.trim() || tokenVerification.name || "Admin User";

    // Create user in MongoDB
    const newUser = await UserModel.create({
      name: userName,
      email: cleanEmail,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now sign in.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * User Login with bcrypt password check & JWT generation
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
      success: true,
      message: "Authentication successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString(),
        expiresIn: config.jwtExpiresIn,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get active session user
 */
export async function getMe(req, res, next) {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Change password
 */
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password verification failed.",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(req.user.id, newHashedPassword);

    return res.json({
      success: true,
      message: "Password changed successfully. Please store your new credentials securely.",
    });
  } catch (err) {
    next(err);
  }
}
