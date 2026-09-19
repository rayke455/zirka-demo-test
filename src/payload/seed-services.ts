import path from "node:path";
import type { Payload } from "payload";
import { services } from "../lib/data";
import { dbKind } from "./db";

/**
 * An upload only survives where the files themselves are stored: Blob when a
 * token is set, otherwise this machine's public/uploads. Seeding a hosted
 * Postgres from a laptop with no Blob token would leave rows pointing at files
 * only the laptop has, so we skip the photo and let the static /images
 * fallbacks in lib/cms.ts show instead — the team uploads real ones in admin.
 */
const uploadsPersist = Boolean(process.env.BLOB_READ_WRITE_TOKEN) || dbKind === "sqlite";

/**
 * Creates every service from data.ts, uploading its photo into the media
 * library so the team can replace it from the admin later.
 */
export async function seedServices(payload: Payload) {
  for (const [i, s] of services.entries()) {
    const media = uploadsPersist
      ? await payload.create({
          collection: "media",
          data: { alt: s.alt },
          filePath: path.resolve(process.cwd(), "public", s.image.replace(/^\//, "")),
        })
      : null;

    await payload.create({
      collection: "services",
      data: {
        _status: "published",
        name: s.name,
        slug: s.slug,
        order: i,
        core: s.core,
        short: s.short,
        problem: s.problem,
        description: s.description,
        capabilities: s.capabilities.map((label) => ({ label })),
        accent: s.plate,
        icon: s.icon,
        image: media?.id ?? null,
      },
    });
    console.log(`  ${s.core ? "core " : "     "} ${s.name}`);
  }
}
