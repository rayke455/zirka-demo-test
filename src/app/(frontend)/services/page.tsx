import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CtaBand from "@/components/CtaBand";
import ServiceCard from "@/components/ServiceCard";
import JsonLd from "@/components/JsonLd";
import { getServices } from "@/lib/cms";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital advertising, social media, websites, SEO, content, WhatsApp marketing, AI automation and more — every service Zirka Digital Solutions offers.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  const core = services.filter((s) => s.core);
  const rest = services.filter((s) => !s.core);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <PageHeader
        eyebrow="What we do"
        title="Everything your marketing needs."
        lede={`${services.length} services across advertising, social, content, web, SEO, WhatsApp and automation. Take one, or let us run the lot together.`}
      />

      <section className="section--index">
        <div className="wrap">
          <h2 className="index-heading">All services</h2>
          <ol className="service-index">
            {services.map((service, i) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>
                  <span className="service-index__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="service-index__name">{service.name}</span>
                  <span className="service-index__count">
                    {service.capabilities.length} included
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {core.length > 0 && (
        <section className="section--flow">
          <div className="wrap">
            <h2 className="index-heading">What we&rsquo;re known for</h2>
            <div className="service-grid">
              {core.map((service) => (
                <ServiceCard service={service} key={service.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="section--flow">
          <div className="wrap">
            <h2 className="index-heading">Also available</h2>
            <div className="service-grid">
              {rest.map((service) => (
                <ServiceCard service={service} key={service.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand heading="Not sure which mix is right?" />
    </>
  );
}
