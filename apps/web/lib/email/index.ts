import "server-only";

export async function sendTransactionalEmail(input: { to: string; subject: string; html: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY is required in production");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "NEXTVACANCY <noreply@nextvacancy.com>",
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Transactional email delivery failed");
}