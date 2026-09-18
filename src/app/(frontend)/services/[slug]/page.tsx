import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CtaBand from "@/components/CtaBand";
import WorkCard from "@/components/WorkCard";
import JsonLd from "@/components/JsonLd";
import VideoEmbed, { hasVideo } from "@/components/VideoEmbed";
import { CheckIcon, ArrowIcon } from "@/components/Icons";
import { getService, getServices, getServiceSitemap, getSettings } from "@/lib/cms";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

/** Build every service page up front; there are a few dozen at most. */
export async function generateStaticParams() {
  const services = await getServiceSitemap();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.name,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | Zirka Digital Solutions`,
      description: service.short,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, settings, all] = await Promise.all([
    getService(slug),
    getSettings(),
    getServices(),
  ]);
  if (!service) notFound();

  const others = all.filter((s) => s.slug !== service.slug);

  const paragraphs = service.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd data={serviceSchema(service, settings.companyName)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />

      <div className={`service-hero ${service.plate}`}>
        <Image
          className="service-hero__photo"
          src={service.image}
          alt={service.alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="wrap">
          <Header />
          <div className="service-hero__inner">
            <Link className="case-back" href="/services">
              <ArrowIcon /> All services
            </Link>
            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
              {service.core ? "Core service" : "Service"}
            </span>
            <h1>{service.name}</h1>
            <p className="lede">{service.short}</p>
            {/* The audit is the primary action (brief §21); a quote stays available for
                someone who already knows they want this service. */}
            <div className="hero-ctas">
              <Link className="btn btn-gold" href="/free-marketing-audit" data-track="main_cta_click">
                Get a Free Marketing Audit
              </Link>
              <Link className="btn btn-ghost" href={`/quote?service=${service.slug}`}>
                Get a quote for this service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="section--flow">
        <div className="wrap">
          <div className="service-page">
            <div className="service-page__intro">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {service.outcomes && <div className="outcome">{service.outcomes}</div>}
            </div>

            {service.capabilities.length > 0 && (
              <div className="service-page__block">
                <h2>What&rsquo;s included</h2>
                <ul className="capability-list">
                  {service.capabilities.map((cap) => (
                    <li key={cap}>
                      <span className="capability-mark">
                        <CheckIcon />
                      </span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasVideo(service.video) && (
              <div className="service-page__block">
                <VideoEmbed video={service.video} title={service.video.title} />
              </div>
            )}
          </div>
        </div>
      </section>

      {service.relatedWork.length > 0 && (
        <section className="section--flow">
          <div className="wrap">
            <h2 className="index-heading">
              {service.relatedWork.some((w) => !w.sample)
                ? "Where we’ve done this"
                : "Related concept projects"}
            </h2>
            <div className="work-grid wide">
              {service.relatedWork.map((item) => (
                <WorkCard item={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section--index">
          <div className="wrap">
            <h2 className="index-heading">Other services</h2>
            <ol className="service-index">
              {others.map((other, i) => (
                <li key={other.slug}>
                  <Link href={`/services/${other.slug}`}>
                    <span className="service-index__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="service-index__name">{other.name}</span>
                    <span className="service-index__count">
                      {other.capabilities.length} included
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <CtaBand heading={`Ready to get started with ${service.name}?`} />
    </>
  );
}
