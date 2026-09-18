/**
 * Creates the first super admin on whichever database DATABASE_URI points at.
 * Run with: npm run create:admin
 *
 * The password is generated and written to ADMIN-LOGIN.txt (gitignored) rather
 * than printed, so it does not end up in a terminal log or screen share.
 * Set SEED_ADMIN_EMAIL to use an address other than the default.
 */
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "../payload.config";

const email = process.env.SEED_ADMIN_EMAIL || "dukalalikessolutions@gmail.com";

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
  depth: 0,
});

if (existing.totalDocs > 0) {
  console.log(`super admin already exists: ${email}`);
} else {
  const password = `Zirka-${randomBytes(9).toString("base64url")}`;
  await payload.create({
    collection: "users",
    data: { email, password, name: "Zirka Owner", role: "superadmin" },
  });
  writeFileSync(
    "ADMIN-LOGIN.txt",
    [
      "Zirka admin login",
      "",
      `Email:    ${email}`,
      `Password: ${password}`,
      "",
      "Change this password after your first login: Admin > Users > your account.",
      "This file is gitignored. Delete it once the password is saved somewhere safe.",
      "",
    ].join("\n")
  );
  console.log(`created super admin ${email} — password written to ADMIN-LOGIN.txt`);
}

const all = await payload.find({ collection: "users", limit: 50, depth: 0 });
const list = all.docs as { email: string; role?: string }[];
console.log(
  "accounts on this database:",
  list.map((u) => `${u.email} (${u.role})`).join(", ") || "none"
);

process.exit(0);
