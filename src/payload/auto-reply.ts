import type { Payload } from "payload";
import { escapeHtml, mailSetup } from "./mailer";

type Kind = "enquiry" | "audit" | "quote";

type Settings = {
  autoReplyEnabled?: boolean | null;
  replyTime?: string | null;
  auditReplyTime?: string | null;
};

const SUBJECT: Record<Kind, string> = {
  enquiry: "We've received your message",
  audit: "We've received your free marketing audit request",
  quote: "We've received your quote request",
};

/**
 * The thank-you a visitor gets straight after sending a form. It never repeats
 * what they typed (beyond a short first name), so the forms can't be used to
 * send someone else an email with a message of the sender's choosing.
 *
 * Only sent through the admin's own mail server (Features → Enquiry alerts),
 * and never allowed to fail the submission, which is already saved.
 */
export async function sendAutoReply(payload: Payload, to: string, name: string, kind: Kind) {
  try {
    const f = (await payload.findGlobal({ slug: "features", depth: 0 })) as unknown as Settings;
    if (f.autoReplyEnabled === false) return;

    const mail = await mailSetup(payload);
    if (!mail.adminSmtp) return;

    const s = (await payload.findGlobal({ slug: "site-settings", depth: 0 })) as {
      whatsapp?: string | null;
      phoneDisplay?: string | null;
    };

    const first = escapeHtml(name.trim().split(/\s+/)[0]?.slice(0, 40) || "there");
    const replyTime = escapeHtml(f.replyTime?.trim() || "as soon as we can");
    const auditTime = escapeHtml(f.auditReplyTime?.trim() || "as soon as we've reviewed it");
    const whatsapp = s.whatsapp?.replace(/\D/g, "");

    const body: Record<Kind, string> = {
      enquiry: `Thanks for getting in touch. Your message has reached our team, and a Zirka strategist will get back to you ${replyTime}.`,
      audit: `Thanks for requesting a free marketing audit. A Zirka strategist will review your website and current marketing, and we'll send your findings ${auditTime}.`,
      quote: `Thanks for your quote request. We'll look at the services you picked and get back to you ${replyTime} with pricing, or with a few questions if we need more detail.`,
    };

    await mail.send({
      to,
      subject: SUBJECT[kind],
      replyTo: mail.teamInbox ?? undefined,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#0e2a20;max-width:560px">
          <p style="font-size:18px;margin:0 0 14px">Hi ${first},</p>
          <p style="margin:0 0 14px">${body[kind]}</p>
          <p style="margin:0 0 14px">Anything to add? Just reply to this email${
            whatsapp && s.phoneDisplay
              ? `, or message us on <a href="https://wa.me/${whatsapp}" style="color:#9c5c33">WhatsApp at ${escapeHtml(s.phoneDisplay)}</a>`
              : ""
          }.</p>
          <p style="margin:0;color:#5f6b64">Zirka Digital Solutions — Where Ideas Become Impact</p>
        </div>`,
    });
  } catch (err) {
    payload.logger.error({ err }, "Could not send automatic reply");
  }
}
