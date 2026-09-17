import type { GlobalConfig } from "payload";
import { isAdmin } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
    description: "Brand details, hero copy and contact channels used across the site.",
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Brand",
          fields: [
            { name: "companyName", type: "text", required: true, defaultValue: "Zirka Digital Solutions" },
            { name: "slogan", type: "text", required: true, defaultValue: "Where Ideas Become Impact" },
            {
              name: "descriptor",
              type: "text",
              defaultValue: "Digital Marketing Agency",
              admin: { description: "The small label above the hero headline." },
            },
          ],
        },
        {
          label: "Homepage hero",
          fields: [
            {
              name: "heroHeadline",
              type: "text",
              required: true,
              defaultValue: "Where ideas become impact.",
            },
            {
              name: "heroEmphasis",
              type: "text",
              defaultValue: "impact",
              admin: { description: "Which word in the headline is picked out in copper." },
            },
            { name: "heroLede", type: "textarea", required: true },
            { name: "heroImage", type: "upload", relationTo: "media" },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "whatsapp",
              type: "text",
              defaultValue: "16787994634",
              admin: { description: "Digits only, including country code — used for the wa.me link." },
            },
            { name: "phoneDisplay", type: "text", defaultValue: "+1 (678) 799–4634" },
            { name: "email", type: "email" },
            { name: "socialHandle", type: "text", defaultValue: "zirka digital solutions" },
            { name: "hours", type: "text", defaultValue: "Monday – Friday, 9am – 6pm" },
          ],
        },
        {
          label: "Stats",
          fields: [
            {
              name: "stats",
              type: "array",
              maxRows: 4,
              admin: { description: "The four figures under the hero." },
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
            {
              name: "trustedBy",
              type: "array",
              labels: { singular: "Brand", plural: "Brands" },
              fields: [{ name: "name", type: "text", required: true }],
            },
          ],
        },
      ],
    },
  ],
};
