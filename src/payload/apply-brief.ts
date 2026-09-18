/**
 * Applies the content changes from the Website Implementation Brief.
 * Run with: npm run apply:brief — take a backup first (npm run backup).
 *
 * Safe to re-run: each step sets the brief's wording, so running it twice
 * changes nothing the second time.
 */
import { getPayload } from "payload";
import config from "../payload.config";

const payload = await getPayload({ config });

// --- §2 Homepage hero ---------------------------------------------------------
await payload.updateGlobal({
  slug: "site-settings",
  data: {
    descriptor: "Digital Marketing Agency",
    heroHeadline: "Turn clicks into customers.",
    heroEmphasis: "customers",
    heroLede:
      "Zirka helps growing businesses generate more leads and revenue through paid advertising, SEO, high-converting websites, content, and smart automation.",
  },
});
console.log("hero: Turn clicks into customers.");

process.exit(0);
