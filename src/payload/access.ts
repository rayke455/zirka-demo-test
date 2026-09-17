import type { Access, FieldAccess } from "payload";

export type Role = "superadmin" | "admin" | "worker";

type UserWithRole = { role?: Role } | null | undefined;

const roleOf = (user: UserWithRole): Role | undefined => user?.role;

/** Anyone with a valid login. */
export const isLoggedIn: Access = ({ req }) => Boolean(req.user);

/** Super admins only — user accounts and destructive settings. */
export const isSuperAdmin: Access = ({ req }) => roleOf(req.user as UserWithRole) === "superadmin";

/** Admins and above — pricing, publishing, reading enquiries. */
export const isAdmin: Access = ({ req }) => {
  const role = roleOf(req.user as UserWithRole);
  return role === "superadmin" || role === "admin";
};

/** Any staff member — general content editing. */
export const isStaff: Access = ({ req }) => {
  const role = roleOf(req.user as UserWithRole);
  return role === "superadmin" || role === "admin" || role === "worker";
};

/** Published content is public; drafts stay internal. */
export const isPublicOrStaff: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};

/** Super admins manage anyone; everyone else only their own account. */
export const isSuperAdminOrSelf: Access = ({ req }) => {
  if (roleOf(req.user as UserWithRole) === "superadmin") return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

/** Only super admins may change a role — stops privilege escalation. */
export const superAdminFieldOnly: FieldAccess = ({ req }) =>
  roleOf(req.user as UserWithRole) === "superadmin";
