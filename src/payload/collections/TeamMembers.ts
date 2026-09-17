import type { CollectionConfig } from "payload";
import { isStaff, isPublicOrStaff, isAdmin } from "../access";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team Member", plural: "Team Members" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order", "_status"],
    group: "Content",
    description: "People shown on the about page.",
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
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "text",
      required: true,
      admin: { description: 'Job title, e.g. "Head of Performance Media"' },
    },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "A real photo of this person — square crops work best." },
    },
  ],
};
