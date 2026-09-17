import type { CollectionConfig } from "payload";
import { isStaff, isPublicOrStaff, isAdmin } from "../access";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "featured", "_status"],
    group: "Content",
    description: "Only publish quotes a client has actually given you.",
  },
  access: {
    read: isPublicOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  versions: { drafts: true },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", admin: { description: 'e.g. "Chief Marketing Officer"' } },
    { name: "company", type: "text", required: true },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Show this one in the big quote on the homepage." },
    },
  ],
};
