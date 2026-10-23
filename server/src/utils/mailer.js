import nodemailer from "nodemailer";
import { config } from "../config/env.js";

let transporter = null;

function getTransporter() {
  const { host, port, secure, user, pass } = config.smtp;

  if (user && pass) {
    if (!transporter || transporter.isDevFallback) {
      const isGmail =
        (host && host.includes("gmail.com")) ||
        (user && user.toLowerCase().endsWith("@gmail.com"));

      const transportOptions = isGmail
        ? {
            service: "gmail",
            auth: {
              user,
              pass,
            },
            pool: true, // Keep connections pooled for instant sub-second delivery
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
          }
        : {
            host: host || "smtp.gmail.com",
            port: Number(port) || 587,
            secure: secure === true || Number(port) === 465,
            auth: {
              user,
              pass,
            },
            pool: true,
            maxConnections: 5,
            tls: {
              rejectUnauthorized: false, // Ensures zero SSL handshake issues in cloud containers (Render, AWS, Railway)
            },
          };

      transporter = nodemailer.createTransport(transportOptions);
    }
    return transporter;
  }

  // Fallback logger transporter if SMTP credentials are missing
  return {
    isDevFallback: true,
    async sendMail(mailOptions) {
      console.log("--------------------------------------------------");
      console.log("[SMTP DEV NOTICE] No SMTP_USER/SMTP_PASS in environment.");
      console.log(`[SMTP DEV NOTICE] Destination: ${mailOptions.to}`);
      console.log(`[SMTP DEV NOTICE] Subject: ${mailOptions.subject}`);
      console.log("--------------------------------------------------");
      return { messageId: `dev-${Date.now()}` };
    },
  };
}

/**
 * Sends a 4-digit OTP email to the user with a sleek, responsive HTML layout.
 *
 * @param {string} toEmail - Recipient email address
 * @param {string} name - User's name
 * @param {string} otp - 4-digit verification code
 * @returns {Promise<boolean>}
 */
export async function sendOtpEmail(toEmail, name, otp) {
  const mailer = getTransporter();

  const recipientName = name ? name.trim() : "Admin User";
  const fromAddress =
    config.smtp.from ||
    (config.smtp.user ? `"Ashish Sahu Portfolio" <${config.smtp.user}>` : `"Portfolio Security" <no-reply@ashish.dev>`);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portfolio Console Verification</title>
      <style>
        body { margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5; }
        .wrapper { max-width: 540px; margin: 30px auto; background-color: #121217; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); }
        .header { background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px 32px 24px; border-bottom: 1px solid #27272a; text-align: center; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); margin-bottom: 12px; }
        .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 8px; }
        .content { padding: 32px; }
        .greeting { font-size: 15px; color: #e4e4e7; margin: 0 0 16px; }
        .description { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 24px; }
        .otp-container { text-align: center; margin: 28px 0; padding: 24px; background: rgba(9, 9, 11, 0.8); border: 1px solid #3f3f46; border-radius: 12px; }
        .otp-code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #f59e0b; margin: 0; text-indent: 12px; }
        .otp-timer { font-size: 12px; color: #f59e0b; margin-top: 10px; font-weight: 500; }
        .warning-box { background-color: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin: 20px 0; font-size: 12px; color: #fca5a5; line-height: 1.5; }
        .footer { padding: 24px 32px; background-color: #0c0c0e; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #71717a; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="badge">Security Authentication</div>
          <h1 class="title">Ashish Sahu | Admin Console</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello, <strong>${recipientName}</strong></p>
          <p class="description">
            You requested to register an administrative account on the Portfolio Console. Use the one-time verification code below to confirm your identity and proceed with password creation.
          </p>
          
          <div class="otp-container">
            <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a;">One-Time Verification Code</p>
            <div class="otp-code">${otp}</div>
            <div class="otp-timer">&#x23F1; Valid for 5 minutes only</div>
          </div>

          <div class="warning-box">
            <strong>Security Notice:</strong> Never share this 4-digit code with anyone. Our administrators will never ask for your verification code. This code will automatically expire in 5 minutes.
          </div>

          <p class="description" style="margin-bottom: 0;">
            If you did not initiate this request, you can safely ignore this email. No account will be created without verifying this code.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Ashish Sahu. All rights reserved. &bull; Portfolio Admin Security
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Ashish Sahu | Portfolio Admin Console Verification
--------------------------------------------------
Hello ${recipientName},

Your one-time 4-digit verification code is: ${otp}

This code will expire in 5 minutes.
Never share this code with anyone.

If you did not request this verification, please ignore this email.
`;

  try {
    const info = await mailer.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Your Verification Code: ${otp} (Valid for 5 mins)`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[SMTP SUCCESS] Verification code sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("[Mailer Error] Failed to send email via SMTP:", err.message);
    throw new Error(`Failed to send verification email: ${err.message}`);
  }
}
