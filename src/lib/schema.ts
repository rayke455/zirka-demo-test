/**
 * Schema.org records for search engines. Google reads these to show rich
 * results — the FAQ drop-downs, breadcrumb trails and business panels that make
 * a listing take up more of the page.
 *
 * Only state what the CMS actually holds. An invented address or rating is
 * worse than none: it is a policy violation and it can get rich results pulled
 * for the whole domain. That is why the business is an Organization rather than
 * a LocalBusiness — LocalBusiness expects a street address we do not have.
 */
import { SITE_URL } from "./site";
import type { ServiceDetailView } from "./cms";

/** A stable node id, so every page's records point at one business, not many. */
export const ORG_ID = `${SITE_URL}/#organization`;

const absolute = (url: string) => (url.startsWith("http") ? url : `${SITE_URL}${url}`);

type OrgInput = {
  companyName: string;
  descriptor: string;
  slogan: string;
  phoneDisplay: string;
  email: string;
  whatsapp: string;
  heroImage: string;
};

export const organizationSchema = (s: OrgInput) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: s.companyName,
  url: SITE_URL,
  description: s.descriptor,
  ...(s.slogan ? { slogan: s.slogan } : {}),
  ...(s.heroImage ? { image: absolute(s.heroImage) } : {}),
  logo: `${SITE_URL}/icon.png`,
  ...(s.email ? { email: s.email } : {}),
  // The display number is for people; contactPoint wants E.164.
  ...(s.whatsapp ? { telephone: `+${s.whatsapp.replace(/\D/g, "")}` } : {}),
  ...(s.whatsapp
    ? {
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: `+${s.whatsapp.replace(/\D/g, "")}`,
          url: `https://wa.me/${s.whatsapp.replace(/\D/g, "")}`,
        },
      }
    : {}),
});

export const serviceSchema = (service: ServiceDetailView, companyName: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  serviceType: service.name,
  description: service.description || service.short,
  url: `${SITE_URL}/services/${service.slug}`,
  image: absolute(service.image),
  provider: { "@type": "Organization", "@id": ORG_ID, name: companyName },
  ...(service.capabilities.length > 0
    ? {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.name} — what's included`,
          itemListElement: service.capabilities.map((label) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: label },
          })),
        },
      }
    : {}),
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((step, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: step.name,
    item: `${SITE_URL}${step.path}`,
  })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
