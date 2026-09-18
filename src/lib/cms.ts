import { getPayload } from "payload";
import config from "@payload-config";
import type { Service, CaseStudy, TeamMember, Faq, Engagement, Testimonial } from "@/payload-types";
import { services as seedServices } from "@/lib/data";

export const getCms = async () => getPayload({ config });

type MediaLike = { url?: string | null; alt?: string | null } | string | number | null | undefined;

const urlOf = (media: MediaLike, fallback: string): string =>
  media && typeof media === "object" && typeof media.url === "string" ? media.url : fallback;

const altOf = (media: MediaLike, fallback: string): string =>
  media && typeof media === "object" && typeof media.alt === "string" ? media.alt : fallback;

/**
 * Until the team uploads their own photography, fall back to the images that
 * already ship with the project so the site never renders an empty frame.
 */
const SERVICE_FALLBACK: Record<string, string> = Object.fromEntries(
  seedServices.map((s) => [s.slug, s.image])
);

const WORK_FALLBACK: Record<string, string> = {
  "Solace Skincare": "/images/work-skincare.jpg",
  "Northline Freight": "/images/work-freight.jpg",
  "Verve Coffee Co.": "/images/work-coffee.jpg",
  "Atlas Fitness": "/images/work-fitness.jpg",
  "Harlow & Rye": "/images/work-homegoods.jpg",
  "Meridian Legal": "/images/work-legal.jpg",
};

const TEAM_FALLBACK: Record<string, string> = {
  "Dara Osei": "/images/team-dara.jpg",
  "Marcus Wren": "/images/team-marcus.jpg",
  "Imogen Castellan": "/images/team-imogen.jpg",
  "Teo Alvarez": "/images/team-teo.jpg",
};

const PLACEHOLDER = "/images/svc-performance.jpg";

const published = { _status: { equals: "published" } };

const findAll = async <T>(collection: string, limit = 100): Promise<T[]> => {
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: collection as never,
    limit,
    sort: "order",
    depth: 1,
    where: published,
  });
  return docs as T[];
};

export type ServiceView = {
  slug: string;
  name: string;
  short: string;
  description: string;
  outcomes: string;
  capabilities: string[];
  core: boolean;
  video: { url: string | null; file: string | null; title: string };
  plate: string;
  icon: "target" | "compass" | "network" | "prism";
  image: string;
  alt: string;
};

const toServiceView = (s: Service): ServiceView => ({
  slug: s.slug,
  name: s.name,
  short: s.short,
  description: s.description,
  outcomes: s.outcomes ?? "",
  core: Boolean(s.core),
  video: {
    url: s.videoUrl ?? null,
    file: urlOf(s.videoFile as MediaLike, "") || null,
    title: s.videoTitle || s.name,
  },
  capabilities: (s.capabilities ?? []).map((c) => c.label),
  plate: s.accent ?? "plate-1",
  icon: (s.icon ?? "target") as ServiceView["icon"],
  image: urlOf(s.image as MediaLike, SERVICE_FALLBACK[s.slug] ?? PLACEHOLDER),
  alt: altOf(s.image as MediaLike, s.name),
});

export const getServices = async (): Promise<ServiceView[]> => {
  const docs = await findAll<Service>("services");
  return docs.map(toServiceView);
};

export type WorkView = {
  slug: string;
  name: string;
  category: string;
  metric: string;
  summary: string;
  plate: string;
  image: string;
  alt: string;
};

const toWorkView = (w: CaseStudy): WorkView => ({
  slug: w.slug ?? "",
  name: w.name,
  category: w.category,
  metric: w.metric,
  summary: w.summary,
  plate: w.accent ?? "w1",
  image: urlOf(w.image as MediaLike, WORK_FALLBACK[w.name] ?? PLACEHOLDER),
  alt: altOf(w.image as MediaLike, `${w.name} — ${w.category}`),
});

export const getCaseStudies = async (): Promise<WorkView[]> => {
  const docs = await findAll<CaseStudy>("case-studies");
  return docs.map(toWorkView);
};

/** Portrait card crops blur when stretched across a wide hero, so keep landscape ones. */
const WORK_WIDE_FALLBACK: Record<string, string> = Object.fromEntries(
  Object.entries(WORK_FALLBACK).map(([name, src]) => [name, src.replace(".jpg", "-wide.jpg")])
);

/** Prefer the 1920px "wide" size Payload generates on upload. */
const wideUrlOf = (media: MediaLike, fallback: string): string => {
  if (media && typeof media === "object") {
    const sized = (media as { sizes?: { wide?: { url?: string | null } } }).sizes?.wide?.url;
    if (sized) return sized;
  }
  return urlOf(media, fallback);
};

export type CaseStudyView = WorkView & {
  heroImage: string;
  challenge: string;
  approach: string;
  outcome: string;
  results: { value: string; label: string }[];
  servicesUsed: { name: string; slug: string }[];
};

export const getCaseStudy = async (slug: string): Promise<CaseStudyView | null> => {
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: "case-studies",
    limit: 1,
    depth: 1,
    where: { and: [published, { slug: { equals: slug } }] },
  });
  const w = docs[0] as CaseStudy | undefined;
  if (!w) return null;
  return {
    ...toWorkView(w),
    heroImage: wideUrlOf(w.image as MediaLike, WORK_WIDE_FALLBACK[w.name] ?? "/images/hero.jpg"),
    challenge: w.challenge ?? "",
    approach: w.approach ?? "",
    outcome: w.outcome ?? "",
    results: (w.results ?? []).map((r) => ({ value: r.value, label: r.label })),
    servicesUsed: (w.servicesUsed ?? [])
      .filter((s): s is Service => typeof s === "object" && s !== null)
      .map((s) => ({ name: s.name, slug: s.slug })),
  };
};

export type ServiceDetailView = ServiceView & {
  /** Case studies tagged with this service, so the page can prove the claim. */
  relatedWork: WorkView[];
};

export const getService = async (slug: string): Promise<ServiceDetailView | null> => {
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: "services",
    limit: 1,
    depth: 1,
    where: { and: [published, { slug: { equals: slug } }] },
  });
  const service = docs[0] as Service | undefined;
  if (!service) return null;

  const { docs: studies } = await payload.find({
    collection: "case-studies",
    limit: 3,
    depth: 1,
    where: { and: [published, { servicesUsed: { in: [service.id] } }] },
  });

  return {
    ...toServiceView(service),
    relatedWork: (studies as CaseStudy[]).map(toWorkView),
  };
};

/** Slugs and edit dates for the sitemap and for prerendering every service page. */
export const getServiceSitemap = async () => {
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: "services",
    limit: 500,
    depth: 0,
    sort: "order",
    where: published,
    select: { slug: true, updatedAt: true },
  });
  return (docs as { slug?: string | null; updatedAt: string }[])
    .filter((d) => d.slug)
    .map((d) => ({ slug: d.slug as string, updatedAt: d.updatedAt }));
};

export type TeamView = { name: string; role: string; image: string };

export const getTeam = async (): Promise<TeamView[]> => {
  const docs = await findAll<TeamMember>("team-members");
  return docs.map((m) => ({
    name: m.name,
    role: m.role,
    image: urlOf(m.photo as MediaLike, TEAM_FALLBACK[m.name] ?? PLACEHOLDER),
  }));
};

/** Published case study addresses with their last edit, for the sitemap. */
export const getCaseStudySitemap = async () => {
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: "case-studies",
    limit: 500,
    depth: 0,
    where: published,
    select: { slug: true, updatedAt: true },
  });
  return (docs as { slug?: string | null; updatedAt: string }[])
    .filter((d) => d.slug)
    .map((d) => ({ slug: d.slug as string, updatedAt: d.updatedAt }));
};

export const getFaqs = async () => {
  const docs = await findAll<Faq>("faqs");
  return docs.map((f) => ({ q: f.question, a: f.answer }));
};

export const getProcessSteps = async () => {
  const docs = await findAll<{ name: string; description: string }>("process-steps");
  return docs.map((s, i) => ({
    idx: String(i + 1).padStart(2, "0"),
    name: s.name,
    description: s.description,
  }));
};

export const getValues = async () => {
  const docs = await findAll<{ name: string; description: string }>("values");
  return docs.map((v) => ({ name: v.name, description: v.description }));
};

export const getEngagements = async () => {
  const docs = await findAll<Engagement>("engagements");
  return docs.map((e) => ({
    name: e.name,
    price: e.price,
    cadence: e.cadence,
    summary: e.summary,
    includes: (e.includes ?? []).map((i) => i.label),
    featured: Boolean(e.featured),
  }));
};

export const getFeaturedTestimonial = async () => {
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: "testimonials",
    limit: 1,
    depth: 0,
    where: { and: [published, { featured: { equals: true } }] },
  });
  const t = docs[0] as Testimonial | undefined;
  if (!t) return null;
  return { quote: t.quote, name: t.name, role: t.role ?? "", company: t.company };
};

const FEATURE_DEFAULTS = {
  showStats: true,
  showTrustedBy: true,
  showServices: true,
  showWork: true,
  showTestimonial: true,
  showProcess: true,
  showPricing: true,
  showFaq: true,
  showVideo: true,
  showValues: true,
  showLeadership: true,
  showWhatsApp: true,
  contactFormEnabled: true,
  quotesEnabled: true,
  bookingEnabled: true,
  analyticsEnabled: true,
  alertsEnabled: false,
};

export type FeatureFlags = typeof FEATURE_DEFAULTS;

/**
 * Until the Features page is first saved its values are empty, so an unset
 * switch must mean "default" — otherwise every section would vanish on day one.
 * Read through the local API, which is how the public site reads this
 * super-admin-only global without exposing it.
 */
export const getFeatures = async (): Promise<FeatureFlags> => {
  const payload = await getCms();
  const f = (await payload.findGlobal({ slug: "features", depth: 0 })) as unknown as Record<string, unknown>;
  const flags = { ...FEATURE_DEFAULTS };
  for (const key of Object.keys(FEATURE_DEFAULTS) as (keyof FeatureFlags)[]) {
    if (typeof f[key] === "boolean") flags[key] = f[key] as boolean;
  }
  return flags;
};

export type LegalContent = {
  entity: string;
  jurisdiction: string;
  termsIntro: string;
  refundsIntro: string;
  terms: { heading: string; body: string }[];
  refunds: { heading: string; body: string }[];
};

export const getLegal = async (): Promise<LegalContent> => {
  const payload = await getCms();
  const s = await payload.findGlobal({ slug: "site-settings", depth: 0 });
  const list = (rows: unknown) =>
    Array.isArray(rows)
      ? (rows as { heading?: string; body?: string }[])
          .filter((r) => r.heading && r.body)
          .map((r) => ({ heading: r.heading as string, body: r.body as string }))
      : [];
  return {
    entity: s.legalEntity || "",
    jurisdiction: s.legalJurisdiction || "",
    termsIntro: s.termsIntro || "",
    refundsIntro: s.refundsIntro || "",
    terms: list(s.terms),
    refunds: list(s.refunds),
  };
};

export const getSettings = async () => {
  const payload = await getCms();
  const s = await payload.findGlobal({ slug: "site-settings", depth: 1 });
  return {
    companyName: s.companyName,
    slogan: s.slogan,
    descriptor: s.descriptor ?? "Digital Marketing Agency",
    heroHeadline: s.heroHeadline,
    heroEmphasis: s.heroEmphasis ?? "",
    heroLede: s.heroLede,
    heroImage: urlOf(s.heroImage as MediaLike, "/images/hero.jpg"),
    heroAlt: altOf(
      s.heroImage as MediaLike,
      "Zirka strategists reviewing campaign performance together"
    ),
    video: {
      heading: s.videoHeading || "",
      intro: s.videoIntro || "",
      url: s.videoUrl ?? null,
      file: urlOf(s.videoFile as MediaLike, "") || null,
      poster: urlOf(s.videoPoster as MediaLike, "") || null,
    },
    aboutTitle: s.aboutTitle || "Named for a star.",
    aboutLede:
      s.aboutLede ||
      "Zirka means star — a fixed point to navigate by. That's what we aim to be for the businesses we work with.",
    storyHeading: s.storyHeading || "Who we are",
    story: (s.story ?? []).map((p) => p.text).filter(Boolean),
    storyImage: urlOf(s.storyImage as MediaLike, "/images/about-office.jpg"),
    storyAlt: altOf(s.storyImage as MediaLike, "The Zirka team at work"),
    whatsapp: s.whatsapp ?? "16787994634",
    phoneDisplay: s.phoneDisplay ?? "",
    email: s.email ?? "",
    socialHandle: s.socialHandle ?? "",
    hours: s.hours ?? "",
    stats: (s.stats ?? []).map((x) => ({ num: x.value, label: x.label })),
    trustedBy: (s.trustedBy ?? []).map((x) => x.name),
  };
};
