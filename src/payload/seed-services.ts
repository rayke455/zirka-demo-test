import path from "node:path";
import type { Payload } from "payload";
import { services } from "../lib/data";

/**
 * Creates every service from data.ts, uploading its photo into the media
 * library so the team can replace it from the admin later.
 */
export async function seedServices(payload: Payload) {
  for (const [i, s] of services.entries()) {
    const media = await payload.create({
      collection: "media",
      data: { alt: s.alt },
      filePath: path.resolve(process.cwd(), "public", s.image.replace(/^\//, "")),
    });

    await payload.create({
      collection: "services",
      data: {
        _status: "published",
        name: s.name,
        slug: s.slug,
        order: i,
        core: s.core,
        short: s.short,
        description: s.description,
        capabilities: s.capabilities.map((label) => ({ label })),
        accent: s.plate,
        icon: s.icon,
        image: media.id,
      },
    });
    console.log(`  ${s.core ? "core " : "     "} ${s.name}`);
  }
}
