/**
 * NEXTVACANCY Transactional Email Service
 * 
 * Provides email dispatch capabilities with console logging fallback for development
 * and Resend API integration for production.
 */

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || "NEXTVACANCY <no-reply@nextvacancy.com>";

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, from = DEFAULT_FROM } = options;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "replace-with-resend-api-key") {
    // Development / Test mode — log email output safely
    console.info("================== [DEV EMAIL DISPATCH] ==================");
    console.info(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.info(`From: ${from}`);
    console.info(`Subject: ${subject}`);
    console.info("------------------------ Body ----------------------------");
    console.info(text || html);
    console.info("==========================================================");
    return {
      success: true,
      id: `dev-mock-${Date.now()}`,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Resend API error:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to send email via Resend.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
    };
  } catch (err) {
    console.error("Failed to dispatch email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected email error.",
    };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<SendEmailResult> {
  const subject = "Reset your NEXTVACANCY Password";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #850A42; margin-bottom: 16px;">Password Reset Request</h2>
      <p>We received a request to reset the password for your NEXTVACANCY account.</p>
      <p>Click the button below to choose a new password. This link is valid for 1 hour.</p>
      <div style="margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #850A42; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 13px; color: #64748b;">If you did not request a password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8;">NEXTVACANCY — Official Recruitment & Career Alerts Portal</p>
    </div>
  `;
  const text = `Reset your NEXTVACANCY password by visiting the following URL (valid for 1 hour): ${resetUrl}`;

  return sendEmail({ to, subject, html, text });
}

export async function sendEmailVerificationEmail(
  to: string,
  verificationUrl: string
): Promise<SendEmailResult> {
  const subject = "Verify your NEXTVACANCY Account";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #850A42; margin-bottom: 16px;">Welcome to NEXTVACANCY</h2>
      <p>Thank you for registering. Please verify your email address to activate all career notification features.</p>
      <div style="margin: 32px 0;">
        <a href="${verificationUrl}" style="background-color: #850A42; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 13px; color: #64748b;">This verification link will expire in 24 hours.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8;">NEXTVACANCY — Official Recruitment & Career Alerts Portal</p>
    </div>
  `;
  const text = `Verify your NEXTVACANCY email address by visiting: ${verificationUrl}`;

  return sendEmail({ to, subject, html, text });
}
