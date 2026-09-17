import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import { getCms, getFeatures, getServices, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Get a quote",
  description: "Tell us which services you need and we'll send you a quote.",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const [features, settings, services, { service: preselectSlug }] = await Promise.all([
    getFeatures(),
    getSettings(),
    getServices(),
    searchParams,
  ]);

  if (!features.quotesEnabled) {
    return (
      <>
        <PageHeader
          eyebrow="Get started"
          title="Let's talk about your project."
          lede="Online quote requests are paused. Message us on WhatsApp and we'll get you a price."
        />
        <section>
          <div className="wrap hero-ctas">
            <a className="btn btn-gold" href={`https://wa.me/${settings.whatsapp}`}>
              Message us on WhatsApp
            </a>
            <Link className="btn btn-outline" href="/contact">
              Send a message instead
            </Link>
          </div>
        </section>
      </>
    );
  }

  // The admin holds ids, not slugs, so match the slug from the link here.
  const payload = await getCms();
  const { docs } = await payload.find({
    collection: "services",
    limit: 100,
    depth: 0,
    sort: "order",
    where: { _status: { equals: "published" } },
    select: { slug: true, name: true, short: true },
  });
  const options = (docs as { id: number; slug: string; name: string; short: string }[]).map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    short: s.short,
  }));

  const preselected = options.filter((o) => o.slug === preselectSlug).map((o) => o.id);

  return (
    <>
      <PageHeader
        eyebrow="Get started"
        title="Tell us what you need."
        lede={`Pick the services you're interested in and we'll send you a quote — usually within one business day. ${services.length} services to choose from, and you can select more than one.`}
      />
      <section>
        <div className="wrap">
          <QuoteForm
            services={options.map(({ id, name, short }) => ({ id, name, short }))}
            preselected={preselected}
          />
        </div>
      </section>
    </>
  );
}
