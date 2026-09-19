import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { isSuperAdmin } from "../access";

/** Accepts the bare code or the whole <meta … content="…"> tag and keeps just the code. */
const verificationCode = (value: unknown) => {
  if (!value) return value;
  const text = String(value).trim();
  return (text.match(/content\s*=\s*["']([^"']+)["']/i)?.[1] ?? text).trim();
};

const toggle = (name: string, label: string, description: string, defaultValue = true) => ({
  name,
  label,
  type: "checkbox" as const,
  defaultValue,
  admin: { description },
});

/**
 * Super-admin-only switchboard. The public site reads these through the
 * server-side API, so none of it — least of all the mail password — is exposed
 * through the public REST API.
 */
export const Features: GlobalConfig = {
  slug: "features",
  label: "Features",
  admin: {
    group: "Super Admin",
    description: "Turn parts of the website on or off. Changes apply as soon as you save.",
    hidden: ({ user }) => (user as { role?: string } | null)?.role !== "superadmin",
  },
  access: {
    read: isSuperAdmin,
    update: isSuperAdmin,
  },
  hooks: {
    afterChange: [
      // Pages are cached for up to a minute. A switch — maintenance above all —
      // should take effect when it is saved, not a minute later.
      () => {
        try {
          revalidatePath("/", "layout");
          revalidatePath("/site-status");
        } catch {
          // Saved from a script outside the web server: nothing cached to clear.
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Maintenance",
          description:
            "Close the public website while you work on it. Visitors see your logo, a short message and how to contact you. The admin keeps working, and signed-in admins can still preview the full site from the dashboard.",
          fields: [
            toggle(
              "maintenanceMode",
              "Maintenance mode",
              "When on, every public page shows the maintenance notice instead. Search engines are told the site is temporarily unavailable, so your rankings are kept.",
              false
            ),
            {
              name: "maintenanceHeading",
              label: "Heading",
              type: "text",
              defaultValue: "We're making some improvements.",
            },
            {
              name: "maintenanceMessage",
              label: "Message",
              type: "textarea",
              defaultValue:
                "Our website is being updated and will be back shortly. We're still working in the meantime, and happy to help.",
            },
          ],
        },
        {
          label: "Homepage sections",
          fields: [
            toggle("showStats", "Stats strip", "The four figures under the homepage headline."),
            toggle("showTrustedBy", "Trusted by", "The row of client names below the hero."),
            toggle("showServices", "Solutions", "The four solution categories on the homepage."),
            toggle("showWork", "Selected work", "The case studies on the homepage."),
            toggle("showTestimonial", "Testimonial", "The large client quote (only appears if one is published)."),
            toggle("showWhoWeHelp", "Who we help", "Who Zirka works with. Edit the wording under Site Settings → Who we help."),
            toggle("showProcess", "How we work", "The numbered process steps."),
            toggle("showPricing", "Pricing", "The engagement tiers and prices."),
            toggle("showFaq", "FAQ", "Common questions."),
            toggle("showVideo", "Video section", "The homepage video. Only appears when a video is set under Site Settings → Homepage video."),
          ],
        },
        {
          label: "About page",
          fields: [
            toggle("showValues", "How we think", "The operating principles."),
            toggle("showLeadership", "Leadership", "The team members and their photos."),
          ],
        },
        {
          label: "Contact & WhatsApp",
          fields: [
            toggle("showWhatsApp", "WhatsApp buttons", "WhatsApp buttons in the hero and closing banners."),
            toggle("contactFormEnabled", "Contact form", "When off, the contact page shows your WhatsApp and details only."),
            toggle("quotesEnabled", "Quote requests", "Let visitors pick services and request a quote from the website."),
            toggle("bookingEnabled", "Online booking", "Let people book a free consultation from the website. Set your hours under Bookings → Booking Availability."),
          ],
        },
        {
          label: "Visitor analytics",
          fields: [
            toggle(
              "analyticsEnabled",
              "Record page views",
              "Anonymous page-view counting for the dashboard charts. Turning this off stops new data; existing data is kept."
            ),
            {
              name: "gaMeasurementId",
              label: "Google Analytics measurement ID",
              type: "text",
              admin: {
                placeholder: "G-XXXXXXXXXX",
                description:
                  "Paste the ID from Google Analytics → Admin → Data streams → your website. Leave empty to keep Google Analytics off. The privacy policy updates itself to match.",
              },
              validate: (value: unknown) =>
                !value || /^G-[A-Z0-9]{4,20}$/.test(String(value).trim().toUpperCase())
                  ? true
                  : "That doesn't look like a measurement ID. It starts with G-, for example G-AB12CD34EF.",
              hooks: {
                beforeChange: [({ value }) => (value ? String(value).trim().toUpperCase() : value)],
              },
            },
          ],
        },
        {
          label: "Search engines",
          description:
            "Prove to Google and Bing that you own this website, so you can see which searches find you. Paste the code each one gives you. The whole <meta …> tag works too.",
          fields: [
            {
              name: "googleVerification",
              label: "Google Search Console code",
              type: "text",
              admin: {
                placeholder: "e.g. aBcD123…",
                description:
                  "In Search Console, add a URL-prefix property for https://zirkadigitalsolutions.com and pick the “HTML tag” method. Save here first, then press Verify there.",
              },
              hooks: { beforeChange: [({ value }) => verificationCode(value)] },
            },
            {
              name: "bingVerification",
              label: "Bing Webmaster Tools code",
              type: "text",
              admin: {
                description:
                  "In Bing Webmaster Tools, choose the “Meta tag” option. Or simply import your site from Google Search Console and skip this.",
              },
              hooks: { beforeChange: [({ value }) => verificationCode(value)] },
            },
          ],
        },
        {
          label: "Enquiry alerts",
          description:
            "Email you whenever someone sends a form, and send them an automatic thank-you. Both need the mail server below.",
          fields: [
            toggle("alertsEnabled", "Send enquiry alerts", "Email a notification for every new enquiry.", false),
            {
              name: "notifyEmail",
              label: "Send alerts to",
              type: "email",
              admin: {
                description: "The inbox that receives new-enquiry alerts.",
                condition: (data) => Boolean(data?.alertsEnabled),
              },
            },
            {
              type: "collapsible",
              label: "Mail server (the account that sends the alert)",
              admin: { condition: (data) => Boolean(data?.alertsEnabled) },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "smtpHost",
                      label: "Server",
                      type: "text",
                      admin: { width: "60%", description: "e.g. smtp.gmail.com" },
                    },
                    {
                      name: "smtpPort",
                      label: "Port",
                      type: "number",
                      defaultValue: 465,
                      admin: { width: "40%", description: "465 (SSL) or 587" },
                    },
                  ],
                },
                {
                  name: "smtpUser",
                  label: "Username",
                  type: "text",
                  admin: { description: "Usually the full email address that sends." },
                },
                {
                  name: "smtpPass",
                  label: "Password",
                  type: "text",
                  admin: {
                    description:
                      "For Gmail, an App Password — never your normal password. Visible only to super admins.",
                  },
                },
                {
                  name: "fromAddress",
                  label: "Send from",
                  type: "email",
                  admin: { description: "Leave blank to use the username." },
                },
              ],
            },
            {
              type: "collapsible",
              label: "Automatic reply to the person who sent the form",
              admin: { condition: (data) => Boolean(data?.alertsEnabled) },
              fields: [
                toggle(
                  "autoReplyEnabled",
                  "Send an automatic thank-you",
                  "Right after someone sends the contact, free-audit or quote form, they get a short email confirming we have it. Booked calls already get their own confirmation."
                ),
                {
                  name: "replyTime",
                  label: "When you reply to enquiries",
                  type: "text",
                  admin: {
                    placeholder: "within one business day",
                    description:
                      "Finishes the sentence “We'll get back to you …”. Only promise what you can keep. Leave blank to say “as soon as we can”.",
                  },
                },
                {
                  name: "auditReplyTime",
                  label: "When audit results are sent",
                  type: "text",
                  admin: {
                    placeholder: "within 3 business days",
                    description:
                      "Finishes “We'll send your findings …”. Leave blank to say “as soon as we've reviewed it”.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
