import { Resend } from "resend";
import { config } from "../config/env.js";

let resendClient = null;
let cachedApiKey = "";

function getResendClient() {
  const apiKey = config.resend.apiKey?.trim();
  if (!apiKey) {
    throw new Error(
      "Resend API key is missing. Please set RESEND_API_KEY in your server/.env file."
    );
  }

  if (!resendClient || cachedApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    cachedApiKey = apiKey;
  }

  return resendClient;
}

/**
 * Generates an editorial-grade, responsive HTML email for OTP delivery
 */
function buildOtpEmailHtml({ name, otp, expiryMinutes }) {
  const recipientName = name ? name.trim() : "Admin User";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio Console Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #09090b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #f4f4f5;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 560px;
      margin: 36px auto;
      background-color: #121217;
      border: 1px solid #27272a;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      background: linear-gradient(135deg, #18181b 0%, #09090b 100%);
      padding: 36px 32px 28px;
      border-bottom: 1px solid #27272a;
      text-align: center;
    }
    .brand-badge {
      display: inline-block;
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background-color: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
      margin-bottom: 14px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 13px;
      color: #a1a1aa;
      margin: 0;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 15px;
      font-weight: 600;
      color: #f4f4f5;
      margin: 0 0 12px;
    }
    .paragraph {
      font-size: 14px;
      color: #a1a1aa;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .otp-card {
      background: #09090b;
      border: 1px solid #3f3f46;
      border-radius: 14px;
      padding: 28px 20px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #71717a;
      margin-bottom: 8px;
    }
    .otp-digits {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 14px;
      color: #f59e0b;
      margin: 0;
      text-indent: 14px;
    }
    .otp-meta {
      font-size: 12px;
      color: #a1a1aa;
      margin-top: 12px;
      font-weight: 500;
    }
    .warning {
      background-color: rgba(239, 68, 68, 0.08);
      border-left: 3px solid #ef4444;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      color: #fca5a5;
      line-height: 1.5;
      margin: 24px 0 0;
    }
    .footer {
      padding: 24px 32px;
      background-color: #0a0a0c;
      border-top: 1px solid #27272a;
      text-align: center;
      font-size: 11px;
      color: #71717a;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="brand-badge">Resend Security Verification</span>
      <h1 class="title">Administrative One-Time Passcode</h1>
      <p class="subtitle">Ashish Sahu Portfolio Console Authorization</p>
    </div>

    <div class="content">
      <p class="greeting">Hello, ${recipientName}</p>
      <p class="paragraph">
        We received a request to verify your identity and authorize administrative access. Use the 6-digit one-time passcode below to complete your authentication.
      </p>

      <div class="otp-card">
        <div class="otp-label">Verification Code</div>
        <div class="otp-digits">${otp}</div>
        <div class="otp-meta">&#9201; Expires in ${expiryMinutes} minutes &bull; Single-use only</div>
      </div>

      <div class="warning">
        <strong>Security Notice:</strong> Never share this verification code with anyone. If you did not initiate this authentication request, no action is needed and your account remains secure.
      </div>
    </div>

    <div class="footer">
      This is an automated security dispatch sent via Resend.<br />
      Ashish Sahu Portfolio Platform &bull; All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends a production-ready OTP email using Resend
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Recipient name
 * @param {string} options.otp - 6-digit verification code
 * @param {number} [options.expiryMinutes=10] - Validity duration in minutes
 * @returns {Promise<{ success: boolean, messageId: string }>}
 */
export async function sendOtpEmailViaResend({ to, name, otp, expiryMinutes = 10 }) {
  if (!to || !to.trim()) {
    throw new Error("Recipient email address is required.");
  }
  if (!otp || !otp.trim()) {
    throw new Error("OTP verification code is required.");
  }

  const resend = getResendClient();
  let fromEmail = config.resend.fromEmail || "Portfolio Security <onboarding@resend.dev>";
  
  // Resend restriction: public free email domains (@gmail.com, @yahoo.com, etc.) cannot be used as sender without domain DNS verification.
  // Fall back automatically to Resend's default verified testing sender if an unverified public domain is passed.
  if (/@(gmail|yahoo|hotmail|outlook|icloud)\.com/i.test(fromEmail)) {
    fromEmail = "Portfolio Security <onboarding@resend.dev>";
  }

  const cleanTo = to.trim().toLowerCase();

  const html = buildOtpEmailHtml({
    name,
    otp: otp.trim(),
    expiryMinutes,
  });

  const text = `Hello ${name || "Admin User"},\n\nYour 6-digit verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes. If you did not request this, please disregard.\n\nAshish Sahu Portfolio Security`;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [cleanTo],
    subject: `${otp} is your verification code`,
    html,
    text,
  });

  if (error) {
    console.error("[Resend API Error]:", error);
    let friendlyMessage = error.message;
    if (error.statusCode === 403 && error.message?.includes("domain")) {
      friendlyMessage = `Resend Sender Domain Error: ${error.message}. Please use 'Portfolio Security <onboarding@resend.dev>' or verify your custom domain on Resend.`;
    }
    const err = new Error(friendlyMessage || "Failed to deliver OTP via Resend.");
    err.resendError = error;
    err.statusCode = error.statusCode || 502;
    throw err;
  }

  return {
    success: true,
    messageId: data?.id,
  };
}
