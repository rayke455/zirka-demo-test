import type { CollectionConfig } from "payload";
import { isAdmin, isPublicOrStaff } from "../access";

export const Engagements: CollectionConfig = {
  slug: "engagements",
  labels: { singular: "Pricing Tier", plural: "Pricing Tiers" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "featured", "_status"],
    group: "Pricing",
    description: "Pricing is restricted to admins and super admins.",
  },
  // Pricing is commercially sensitive — workers cannot touch it.
  access: {
    read: isPublicOrStaff,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: { drafts: true },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true, admin: { description: 'e.g. "Growth Retainer"' } },
    { name: "price", type: "text", required: true, admin: { description: 'e.g. "$5,000 – $12,000"' } },
    {
      name: "cadence",
      type: "text",
      required: true,
      defaultValue: "per month",
      admin: { description: 'e.g. "per month" or "one-off scope"' },
    },
    { name: "summary", type: "textarea", required: true },
    {
      name: "includes",
      type: "array",
      // A tier described in a sentence rather than a list (Custom Partnership)
      // has no line items, so this cannot be required.
      labels: { singular: "Line item", plural: "Line items" },
      fields: [{ name: "label", type: "text", required: true }],
    },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: 'Highlights the tier and adds the "Most common" badge.' },
    },
  ],
};
