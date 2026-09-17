import type { CollectionConfig } from "payload";
import { isStaff, isPublicOrStaff, isAdmin } from "../access";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "_status"],
    group: "Content",
    description: "The disciplines listed on the homepage and services page.",
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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Used in the page link, e.g. performance-marketing" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
    {
      type: "collapsible",
      label: "Video (optional)",
      admin: { description: "Shown inside this service on the services page." },
      fields: [
        {
          name: "videoUrl",
          label: "Video link",
          type: "text",
          admin: { description: "A YouTube or Vimeo link. Leave blank if you upload a file below." },
        },
        {
          name: "videoFile",
          label: "Or upload a video file",
          type: "upload",
          relationTo: "media",
        },
        { name: "videoTitle", type: "text", admin: { description: "Used as the player title for screen readers." } },
      ],
    },
    {
      name: "core",
      label: "Core service — promote on the homepage",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Every published service appears on the Services page; ticked ones also appear on the homepage." },
    },
    {
      name: "short",
      type: "textarea",
      required: true,
      admin: { description: "One or two lines, shown on the homepage card." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "The longer version, shown on the services page." },
    },
    {
      name: "outcomes",
      type: "text",
      admin: { description: 'e.g. "Typical engagement: 3.2–4.1× ROAS in two quarters."' },
    },
    {
      name: "capabilities",
      type: "array",
      minRows: 1,
      labels: { singular: "Capability", plural: "Capabilities" },
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Photo shown behind the colour wash on the card." },
    },
    {
      name: "accent",
      type: "select",
      defaultValue: "plate-1",
      admin: { description: "Which brand colour wash sits over the photo." },
      options: [
        { label: "Green to copper", value: "plate-1" },
        { label: "Deep green to sage", value: "plate-2" },
        { label: "Olive to copper", value: "plate-3" },
        { label: "Forest to teal", value: "plate-4" },
      ],
    },
    {
      name: "icon",
      type: "select",
      defaultValue: "target",
      options: [
        { label: "Target", value: "target" },
        { label: "Compass", value: "compass" },
        { label: "Constellation", value: "network" },
        { label: "Prism", value: "prism" },
      ],
    },
  ],
};
