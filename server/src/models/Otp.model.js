import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OtpModel as Otp } from "../db/schemas.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const COOLDOWN_MS = 60 * 1000; // 60 seconds resend cooldown
const MAX_VERIFICATION_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour rate limiting window
const MAX_REQUESTS_PER_WINDOW = 5;

export const OtpService = {
  /**
   * Generates a cryptographically secure 6-digit numeric OTP
   */
  generate6DigitOtp() {
    return String(crypto.randomInt(100000, 1000000));
  },

  /**
   * Check rate limiting and cooldown before sending an OTP
   */
  async checkRateLimits(email, ip = "") {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await Otp.findOne({ email: cleanEmail });

    if (!existing) {
      return { allowed: true };
    }

    const now = Date.now();

    // 1. Resend Cooldown Check (60 seconds)
    if (existing.cooldownUntil && new Date(existing.cooldownUntil).getTime() > now) {
      const remainingSeconds = Math.ceil(
        (new Date(existing.cooldownUntil).getTime() - now) / 1000
      );
      return {
        allowed: false,
        code: "COOLDOWN_ACTIVE",
        message: `Please wait ${remainingSeconds} second${
          remainingSeconds > 1 ? "s" : ""
        } before requesting another OTP.`,
        retryAfter: remainingSeconds,
      };
    }

    // 2. Hourly Rate Limit Check (5 requests per hour)
    const windowStart = new Date(existing.firstRequestAt || existing.createdAt || now).getTime();
    if (now - windowStart < RATE_LIMIT_WINDOW_MS) {
      if ((existing.requestCount || 1) >= MAX_REQUESTS_PER_WINDOW) {
        const resetMinutes = Math.ceil((windowStart + RATE_LIMIT_WINDOW_MS - now) / 60000);
        return {
          allowed: false,
          code: "RATE_LIMIT_EXCEEDED",
          message: `Too many OTP requests for this email address. Please wait ${resetMinutes} minute${
            resetMinutes > 1 ? "s" : ""
          } before trying again.`,
          retryAfterMinutes: resetMinutes,
        };
      }
    }

    return { allowed: true, existingDoc: existing };
  },

  /**
   * Create and securely persist a hashed 6-digit OTP
   */
  async createOtp(email, name, plainOtp, ip = "", purpose = "registration") {
    if (!email || !plainOtp) {
      throw new Error("Email and OTP are required.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MS);
    const cooldownUntil = new Date(now.getTime() + COOLDOWN_MS);

    // Securely hash the 6-digit OTP with bcrypt
    const otpHash = await bcrypt.hash(String(plainOtp), 10);
    const id = `otp_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    // Calculate request count within current rolling window
    const existing = await Otp.findOne({ email: cleanEmail });
    let requestCount = 1;
    let firstRequestAt = now;

    if (existing) {
      const windowStart = new Date(existing.firstRequestAt || existing.createdAt || now).getTime();
      if (now.getTime() - windowStart < RATE_LIMIT_WINDOW_MS) {
        requestCount = (existing.requestCount || 1) + 1;
        firstRequestAt = existing.firstRequestAt || now;
      }
      // Remove previous active OTP
      await Otp.deleteMany({ email: cleanEmail });
    }

    const newOtp = await Otp.create({
      id,
      email: cleanEmail,
      name: name ? name.trim() : "",
      otpHash,
      verificationToken: null,
      attempts: 0,
      verified: false,
      expiresAt,
      cooldownUntil,
      lastSentAt: now,
      requestCount,
      firstRequestAt,
      ip,
      purpose,
    });

    return {
      id: newOtp.id,
      email: newOtp.email,
      expiresAt: newOtp.expiresAt,
      cooldownSeconds: 60,
      expiryMinutes: 10,
    };
  },

  /**
   * Invalidate any active OTPs for an email
   */
  async deleteOtp(email) {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();
    await Otp.deleteMany({ email: cleanEmail });
  },

  /**
   * Verify an entered 6-digit OTP against its bcrypt hash
   */
  async verifyOtp(email, enteredOtp) {
    if (!email || !enteredOtp) {
      return {
        success: false,
        message: "Email address and 6-digit verification code are required.",
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(enteredOtp).trim();

    const otpDoc = await Otp.findOne({ email: cleanEmail });

    if (!otpDoc) {
      return {
        success: false,
        code: "NO_ACTIVE_OTP",
        message: "No pending verification code found. Please request a new code.",
      };
    }

    // Check expiration (10 minutes)
    if (new Date() > otpDoc.expiresAt) {
      await Otp.deleteMany({ email: cleanEmail });
      return {
        success: false,
        code: "EXPIRED",
        message: "Verification code has expired. Please request a new code.",
      };
    }

    // Check attempt limits (max 5)
    if (otpDoc.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await Otp.deleteMany({ email: cleanEmail });
      return {
        success: false,
        code: "MAX_ATTEMPTS",
        message: "Maximum verification attempts exceeded. For security, please request a new code.",
      };
    }

    // Compare entered code with bcrypt hash
    const isMatch = await bcrypt.compare(cleanOtp, otpDoc.otpHash);

    if (!isMatch) {
      const updatedAttempts = otpDoc.attempts + 1;
      await Otp.updateOne({ id: otpDoc.id }, { $set: { attempts: updatedAttempts } });

      const remaining = MAX_VERIFICATION_ATTEMPTS - updatedAttempts;
      if (remaining <= 0) {
        await Otp.deleteMany({ email: cleanEmail });
        return {
          success: false,
          code: "MAX_ATTEMPTS",
          message: "Incorrect code. Maximum verification attempts reached. Please request a new code.",
        };
      }

      return {
        success: false,
        code: "INVALID_OTP",
        message: `Incorrect verification code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`,
        remainingAttempts: remaining,
      };
    }

    // Valid OTP: issue a single-use verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await Otp.updateOne(
      { id: otpDoc.id },
      {
        $set: {
          verified: true,
          verificationToken,
          // Give 10 additional minutes to complete password setup / registration
          expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
        },
      }
    );

    return {
      success: true,
      verificationToken,
      name: otpDoc.name,
      email: cleanEmail,
      message: "Identity verified successfully. You can now complete your authentication.",
    };
  },

  /**
   * Consume verification token and invalidate OTP session upon user creation
   */
  async consumeVerificationToken(email, token) {
    if (!email || !token) return { valid: false };

    const cleanEmail = email.trim().toLowerCase();
    const doc = await Otp.findOne({
      email: cleanEmail,
      verificationToken: token,
      verified: true,
    });

    if (!doc) return { valid: false, reason: "Invalid verification token." };

    if (new Date() > doc.expiresAt) {
      await Otp.deleteMany({ email: cleanEmail });
      return { valid: false, reason: "Verification token expired." };
    }

    const userName = doc.name;

    // Invalidate and delete record immediately so it can never be re-used
    await Otp.deleteMany({ email: cleanEmail });

    return { valid: true, name: userName };
  },
};
