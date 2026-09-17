import type { GlobalConfig } from "payload";
import { isSuperAdmin } from "../access";

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
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Homepage sections",
          fields: [
            toggle("showStats", "Stats strip", "The four figures under the homepage headline."),
            toggle("showTrustedBy", "Trusted by", "The row of client names below the hero."),
            toggle("showServices", "Services", "The service cards on the homepage."),
            toggle("showWork", "Selected work", "The case studies on the homepage."),
            toggle("showTestimonial", "Testimonial", "The large client quote (only appears if one is published)."),
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
          ],
        },
        {
          label: "Enquiry alerts",
          description: "Email you whenever someone sends the contact form.",
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
          ],
        },
      ],
    },
  ],
};
