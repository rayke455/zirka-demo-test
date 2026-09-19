import nodemailer from "nodemailer";
import type { Payload } from "payload";

type Features = {
  alertsEnabled?: boolean | null;
  notifyEmail?: string | null;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpUser?: string | null;
  smtpPass?: string | null;
  fromAddress?: string | null;
};

export type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; contentType: string }[];
};

/** Enquiry and booking text comes from strangers — never let it render as HTML. */
export const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Where team alerts go, and how mail is sent. The super admin's Features page
 * wins; .env is the fallback. Returns null when alerts are off everywhere.
 */
export async function mailSetup(payload: Payload) {
  const f = (await payload.findGlobal({ slug: "features", depth: 0 })) as unknown as Features;
  const adminSmtp = Boolean(f.alertsEnabled && f.smtpHost && f.smtpUser && f.smtpPass);
  const teamInbox = adminSmtp ? f.notifyEmail || null : process.env.NOTIFY_EMAIL || null;

  const send = async (mail: Mail) => {
    if (adminSmtp) {
      const port = Number(f.smtpPort || 465);
      await nodemailer
        .createTransport({
          host: f.smtpHost as string,
          port,
          secure: port === 465,
          auth: { user: f.smtpUser as string, pass: f.smtpPass as string },
        })
        .sendMail({
          ...mail,
          from: { name: "Zirka Digital Solutions", address: f.fromAddress || (f.smtpUser as string) },
        });
    } else {
      await payload.sendEmail(mail);
    }
  };

  return { teamInbox, send, adminSmtp };
}
