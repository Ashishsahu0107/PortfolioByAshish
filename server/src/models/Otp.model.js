import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OtpModel as Otp } from "../db/schemas.js";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_VERIFICATION_ATTEMPTS = 3;

export const OtpService = {
  /**
   * Save a hashed OTP with a 5-minute expiration
   */
  async createOtp(email, name, plainOtp) {
    if (!email || !plainOtp) {
      throw new Error("Email and OTP are required.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Invalidate any previous OTPs for this email to prevent replay attacks
    await Otp.deleteMany({ email: cleanEmail });

    // Securely hash the 4-digit OTP using bcrypt (8 rounds for high-speed sub-10ms response)
    const otpHash = await bcrypt.hash(String(plainOtp), 8);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    const id = `otp_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const newOtp = await Otp.create({
      id,
      email: cleanEmail,
      name: name ? name.trim() : "",
      otpHash,
      verificationToken: null,
      attempts: 0,
      verified: false,
      expiresAt,
    });

    return {
      id: newOtp.id,
      email: newOtp.email,
      expiresAt: newOtp.expiresAt,
    };
  },

  /**
   * Delete any active OTPs for this email
   */
  async deleteOtp(email) {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();
    await Otp.deleteMany({ email: cleanEmail });
  },

  /**
   * Verify an entered OTP against the hashed value
   */
  async verifyOtp(email, enteredOtp) {
    if (!email || !enteredOtp) {
      return {
        success: false,
        message: "Email and 4-digit verification code are required.",
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(enteredOtp).trim();

    const otpDoc = await Otp.findOne({ email: cleanEmail });

    if (!otpDoc) {
      return {
        success: false,
        message: "No pending verification code found. Please request a new code.",
      };
    }

    // Check expiration
    if (new Date() > otpDoc.expiresAt) {
      await Otp.deleteMany({ email: cleanEmail });
      return {
        success: false,
        code: "EXPIRED",
        message: "Verification code has expired. Please request a new code.",
      };
    }

    // Check attempt limit
    if (otpDoc.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await Otp.deleteMany({ email: cleanEmail });
      return {
        success: false,
        code: "MAX_ATTEMPTS",
        message: "Maximum verification attempts exceeded. Please request a new code.",
      };
    }

    // Compare with hashed OTP
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
          message: "Incorrect code. Maximum attempts reached. Please request a new code.",
        };
      }

      return {
        success: false,
        code: "INVALID",
        message: `Incorrect verification code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`,
      };
    }

    // Valid OTP: issue a single-use verificationToken for the final password creation step
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await Otp.updateOne(
      { id: otpDoc.id },
      {
        $set: {
          verified: true,
          verificationToken,
          // Give 5 additional minutes to finish setting password
          expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
        },
      }
    );

    return {
      success: true,
      verificationToken,
      name: otpDoc.name,
      email: cleanEmail,
      message: "Verification successful. You can now set your password.",
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

    if (!doc) return { valid: false };

    if (new Date() > doc.expiresAt) {
      await Otp.deleteMany({ email: cleanEmail });
      return { valid: false, reason: "Session expired." };
    }

    const userName = doc.name;

    // Immediately invalidate and delete OTP record so it can NEVER be reused
    await Otp.deleteMany({ email: cleanEmail });

    return { valid: true, name: userName };
  },
};
