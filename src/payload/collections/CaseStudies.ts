import type { CollectionConfig } from "payload";
import { isStaff, isPublicOrStaff, isAdmin } from "../access";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case Study", plural: "Case Studies" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "metric", "_status"],
    group: "Content",
    description: "Client work shown on the homepage, the work page, and each case study's own page.",
  },
  access: {
    read: isPublicOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  versions: { drafts: true },
  defaultSort: "order",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Card",
          description: "What shows on the homepage and work page.",
          fields: [
            { name: "name", type: "text", required: true, admin: { description: "Client name." } },
            {
              name: "category",
              type: "text",
              required: true,
              admin: { description: 'e.g. "Skincare · Performance"' },
            },
            {
              name: "metric",
              type: "text",
              required: true,
              admin: { description: 'The headline result, e.g. "3.2× ROAS in 90 days"' },
            },
            {
              name: "summary",
              type: "textarea",
              required: true,
              admin: { description: "One line on what you did." },
            },
            { name: "image", type: "upload", relationTo: "media" },
            {
              name: "accent",
              type: "select",
              defaultValue: "w1",
              options: [
                { label: "Copper", value: "w1" },
                { label: "Deep green", value: "w2" },
                { label: "Warm brown", value: "w3" },
                { label: "Forest", value: "w4" },
                { label: "Sand", value: "w5" },
                { label: "Teal", value: "w6" },
              ],
            },
          ],
        },
        {
          label: "Full story",
          description: "Shown on the case study's own page. Leave blank to show the card details only.",
          fields: [
            {
              name: "challenge",
              type: "textarea",
              admin: { description: "Where the client was stuck when they came to you." },
            },
            {
              name: "approach",
              type: "textarea",
              admin: { description: "What you did, and why that and not something else." },
            },
            {
              name: "outcome",
              type: "textarea",
              admin: { description: "What changed for the business." },
            },
            {
              name: "results",
              type: "array",
              maxRows: 4,
              labels: { singular: "Result", plural: "Results" },
              admin: { description: "Up to four headline numbers for the results strip." },
              fields: [
                { name: "value", type: "text", required: true, admin: { description: 'e.g. "3.2×"' } },
                { name: "label", type: "text", required: true, admin: { description: 'e.g. "Return on ad spend"' } },
              ],
            },
            {
              name: "servicesUsed",
              type: "relationship",
              relationTo: "services",
              hasMany: true,
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "The page address, e.g. /work/solace-skincare. Filled in from the name automatically.",
      },
      hooks: {
        beforeValidate: [
          // A partial update may not include `name`, so fall back to the saved document.
          // Never store "" — an empty string would collide with every other empty slug.
          ({ value, data, originalDoc }) => {
            if (value) return slugify(String(value));
            const name = data?.name ?? originalDoc?.name;
            return name ? slugify(String(name)) : undefined;
          },
        ],
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first. The first one is the featured card.",
      },
    },
  ],
};
