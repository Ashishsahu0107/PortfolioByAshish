import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { UserModel } from "../models/User.model.js";
import { OtpService } from "../models/Otp.model.js";
import { sendOtpEmailViaResend } from "../services/resend.service.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Step 1: Send a cryptographically secure 6-digit OTP to user's email via Resend
 */
export async function sendRegistrationOtp(req, res, next) {
  try {
    const { email, name } = req.body;
    const clientIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";

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

    // Check rate limits and resend cooldown
    const rateCheck = await OtpService.checkRateLimits(cleanEmail, clientIp);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        code: rateCheck.code,
        message: rateCheck.message,
        retryAfter: rateCheck.retryAfter || 60,
      });
    }

    // Generate secure 6-digit numeric OTP (100000 - 999999)
    const plainOtp = OtpService.generate6DigitOtp();

    // Persist hashed OTP in MongoDB with 10-minute validity and 60-second cooldown
    const created = await OtpService.createOtp(
      cleanEmail,
      name.trim(),
      plainOtp,
      clientIp,
      "registration"
    );

    // Send the OTP via Resend API
    let resendResult = null;
    try {
      resendResult = await sendOtpEmailViaResend({
        to: cleanEmail,
        name: name.trim(),
        otp: plainOtp,
        expiryMinutes: 10,
      });
    } catch (resendErr) {
      console.error("[Resend OTP Dispatch Error]:", resendErr.message);
      // Invalidate the created OTP so the user can retry without getting locked out
      await OtpService.deleteOtp(cleanEmail);
      return res.status(502).json({
        success: false,
        message: `Failed to dispatch OTP via Resend (${resendErr.message}). Please verify RESEND_API_KEY and verified sender settings.`,
      });
    }

    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched via Resend to ${cleanEmail}.`,
      email: cleanEmail,
      cooldownSeconds: 60,
      expiryMinutes: 10,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Step 2: Verify the 6-digit OTP before allowing password creation
 */
export async function verifyRegistrationOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit verification code are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be exactly 6 digits.",
      });
    }

    const verificationResult = await OtpService.verifyOtp(cleanEmail, cleanOtp);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        code: verificationResult.code || "INVALID_OTP",
        message: verificationResult.message,
        remainingAttempts: verificationResult.remainingAttempts,
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
