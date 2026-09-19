import type { ServiceView, SolutionCategoryView } from "./cms";

/**
 * Natural next steps between services, from brief §22: SEO ↔ websites, ads →
 * landing pages and creative, automation → WhatsApp and CRM. These come first;
 * services from the same solution category fill any remaining places.
 */
const CROSS_LINKS: Record<string, string[]> = {
  "seo-online-visibility": ["website-development", "blogging-copywriting"],
  "website-development": ["seo-online-visibility", "lead-generation-sales"],
  "digital-advertising": ["lead-generation-sales", "content-creation"],
  "lead-generation-sales": ["digital-advertising", "website-development"],
  "content-creation": ["social-media-management", "digital-advertising"],
  "social-media-management": ["content-creation", "influencer-marketing"],
  "ai-business-automation": ["whatsapp-marketing", "lead-generation-sales"],
  "whatsapp-marketing": ["ai-business-automation", "lead-generation-sales"],
  "email-marketing": ["ai-business-automation", "content-creation"],
  "branding-graphic-design": ["website-development", "content-creation"],
  "blogging-copywriting": ["seo-online-visibility", "content-creation"],
  "influencer-marketing": ["social-media-management", "content-creation"],
  "analytics-reporting": ["digital-advertising", "digital-marketing-strategy"],
  "digital-marketing-strategy": ["analytics-reporting", "digital-advertising"],
};

export function relatedServices(
  slug: string,
  categories: SolutionCategoryView[],
  services: ServiceView[],
  max = 4
): ServiceView[] {
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const siblings = categories
    .filter((c) => c.services.some((s) => s.slug === slug))
    .flatMap((c) => c.services.map((s) => s.slug));
  const ordered = [...(CROSS_LINKS[slug] ?? []), ...siblings];
  const seen = new Set<string>([slug]);
  const out: ServiceView[] = [];
  for (const s of ordered) {
    const svc = bySlug.get(s);
    if (!svc || seen.has(s)) continue;
    seen.add(s);
    out.push(svc);
    if (out.length === max) break;
  }
  return out;
}
