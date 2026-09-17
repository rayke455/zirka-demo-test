import type { CollectionConfig } from "payload";
import { isAdmin, isStaff } from "../access";

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
