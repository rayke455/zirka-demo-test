import type { Access, FieldAccess, Where } from "payload";

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

/**
 * Account management. Super admins manage everyone. Admins manage workers and
 * their own account — never another admin's, and never a super admin's.
 * Everyone else sees only themselves.
 */
export const canReadUsers: Access = ({ req }) => {
  const role = roleOf(req.user as UserWithRole);
  if (role === "superadmin") return true;
  if (!req.user) return false;
  if (role === "admin") {
    const ownOrWorkers: Where = {
      or: [{ role: { equals: "worker" } }, { id: { equals: req.user.id } }],
    };
    return ownOrWorkers;
  }
  return { id: { equals: req.user.id } };
};

export const canUpdateUsers: Access = canReadUsers;

export const canCreateUsers: Access = ({ req }) => {
  const role = roleOf(req.user as UserWithRole);
  return role === "superadmin" || role === "admin";
};

export const canDeleteUsers: Access = ({ req }) => {
  const role = roleOf(req.user as UserWithRole);
  if (role === "superadmin") return true;
  // An admin may remove workers, but not themselves or anyone at their level.
  if (role === "admin") return { role: { equals: "worker" } };
  return false;
};

/**
 * Who may set the role field at all. Admins are allowed so they can create
 * workers; the collection hook then refuses any value other than "worker".
 */
export const canSetRole: FieldAccess = ({ req }) => {
  const role = roleOf(req.user as UserWithRole);
  return role === "superadmin" || role === "admin";
};

/**
 * For `admin.hidden`: keeps setup-only sections out of everyday accounts'
 * menus and dashboard, so the site owner's staff see only what they use.
 * Super admins still see everything. Access rules are unchanged.
 */
export const hiddenUnlessSuperAdmin = ({ user }: { user?: unknown }) =>
  (user as UserWithRole)?.role !== "superadmin";
