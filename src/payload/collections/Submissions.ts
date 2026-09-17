import type { CollectionConfig } from "payload";
import { isAdmin, isStaff } from "../access";
import { SITE_URL } from "../../lib/site";
import { escapeHtml, mailSetup } from "../mailer";

export const Submissions: CollectionConfig = {
  slug: "submissions",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "budget", "status", "createdAt"],
    group: "Enquiries",
    description: "Messages sent through the website contact form.",
  },
  access: {
    // Closed to the public REST API: the contact form writes through a server
    // action using Payload's local API, which is not bound by this rule.
    create: () => false,
    read: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") return doc;

        const mail = await mailSetup(req.payload);
        const to = mail.teamInbox;
        if (!to) return doc;

        const row = (label: string, value: unknown) =>
          value
            ? `<tr><td style="padding:6px 16px 6px 0;color:#5f6b64;vertical-align:top">${label}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`
            : "";

        const message = {
          to,
          replyTo: doc.email as string,
          subject: `New enquiry from ${String(doc.name).slice(0, 80)}${doc.company ? ` (${String(doc.company).slice(0, 80)})` : ""}`,
          html: `
              <div style="font-family:Arial,sans-serif;font-size:15px;color:#0e2a20;max-width:560px">
                <p style="font-size:18px;margin:0 0 16px">New enquiry through the website</p>
                <table style="border-collapse:collapse;margin-bottom:18px">
                  ${row("Name", doc.name)}
                  ${row("Email", doc.email)}
                  ${row("Company", doc.company)}
                  ${row("Budget", doc.budget)}
                </table>
                <p style="white-space:pre-wrap;background:#f6f3ea;padding:14px 16px;border-radius:8px;margin:0 0 20px">${escapeHtml(doc.message)}</p>
                <p style="margin:0">
                  <a href="${SITE_URL}/admin/collections/submissions/${doc.id}" style="color:#9c5c33">Open in the admin</a>
                  &nbsp;·&nbsp; Reply to this email to answer them directly.
                </p>
              </div>`,
        };

        try {
          await mail.send(message);
        } catch (err) {
          // A mail outage must never lose the enquiry itself — it is already saved.
          req.payload.logger.error({ err }, "Could not send new-enquiry notification");
        }
        return doc;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "company", type: "text" },
    { name: "budget", type: "text" },
    { name: "message", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In conversation", value: "open" },
        { label: "Won", value: "won" },
        { label: "Closed", value: "closed" },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      admin: { description: "Internal only — never shown on the website." },
    },
  ],
};
