import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

/**
 * Email is switched on purely by environment variables, so the site runs fine
 * without it and starts sending the moment SMTP details are added to .env.
 * Without SMTP_HOST, Payload logs outgoing mail to the server console instead.
 */
const port = Number(process.env.SMTP_PORT || 587);

export const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || process.env.SMTP_USER || "",
      defaultFromName: "Zirka Digital Solutions",
      transportOptions: {
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined;
