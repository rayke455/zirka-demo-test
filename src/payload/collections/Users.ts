import type { CollectionConfig, PayloadRequest } from "payload";
import { APIError } from "payload";
import { isSuperAdmin, isSuperAdminOrSelf, superAdminFieldOnly } from "../access";

const countSuperAdmins = async (req: PayloadRequest): Promise<number> => {
  const { totalDocs } = await req.payload.find({
    collection: "users",
    limit: 0,
    depth: 0,
    where: { role: { equals: "superadmin" } },
  });
  return totalDocs;
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Team",
  },
  access: {
    read: isSuperAdminOrSelf,
    create: isSuperAdmin,
    update: isSuperAdminOrSelf,
    delete: isSuperAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    // Without these, the last super admin can lock everyone out of the admin
    // by demoting or deleting their own account.
    beforeChange: [
      async ({ req, originalDoc, data, operation }) => {
        if (operation !== "update") return data;
        const wasSuper = originalDoc?.role === "superadmin";
        const stillSuper = (data.role ?? originalDoc?.role) === "superadmin";
        if (wasSuper && !stillSuper && (await countSuperAdmins(req)) <= 1) {
          throw new APIError(
            "This is the only super admin. Promote someone else before changing this role.",
            400
          );
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const doc = await req.payload.findByID({ collection: "users", id, depth: 0 });
        if (doc?.role === "superadmin" && (await countSuperAdmins(req)) <= 1) {
          throw new APIError(
            "This is the only super admin and cannot be deleted. Promote someone else first.",
            400
          );
        }
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "worker",
      access: {
        create: superAdminFieldOnly,
        update: superAdminFieldOnly,
      },
      admin: {
        description: "Only a super admin can change this.",
      },
      options: [
        { label: "Super Admin — full control, manages user accounts", value: "superadmin" },
        { label: "Admin — all content and pricing, reads enquiries", value: "admin" },
        { label: "Worker — content editing only", value: "worker" },
      ],
    },
    {
      name: "jobTitle",
      type: "text",
      admin: {
        description: "Shown if this person appears on the public team section.",
      },
    },
  ],
};
