/**
 * Writes every collection and global to backups/<timestamp>.json.
 * Run with: npm run backup — before any change that touches live content.
 *
 * Take it BEFORE editing any collection or global in code. Payload reads every
 * field the code defines, so once the code has a field the database does not
 * yet have (i.e. before the migration runs), this backup fails.
 *
 * Captures each document's latest state, drafts included. It does not copy
 * uploaded files (those live in Vercel Blob) or password hashes (Payload never
 * returns them), so restoring means re-uploading media and resetting logins.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";

const payload = await getPayload({ config });

const out: Record<string, unknown> = { takenAt: new Date().toISOString(), collections: {}, globals: {} };
const collections = out.collections as Record<string, unknown[]>;
const globals = out.globals as Record<string, unknown>;

for (const c of payload.config.collections) {
  const { docs } = await payload.find({
    collection: c.slug as never,
    pagination: false,
    depth: 0,
    draft: Boolean(c.versions?.drafts),
    overrideAccess: true,
  });
  collections[c.slug] = docs;
  console.log(`  ${c.slug.padEnd(22)} ${docs.length}`);
}

for (const g of payload.config.globals) {
  globals[g.slug] = await payload.findGlobal({ slug: g.slug as never, depth: 0, overrideAccess: true });
  console.log(`  ${g.slug.padEnd(22)} (global)`);
}

const dir = path.resolve(process.cwd(), "backups");
mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`backup written: ${path.relative(process.cwd(), file)}`);

process.exit(0);
