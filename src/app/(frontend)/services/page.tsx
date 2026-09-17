import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import CtaBand from "@/components/CtaBand";
import Link from "next/link";
import VideoEmbed, { hasVideo } from "@/components/VideoEmbed";
import { ServiceIcon, ArrowIcon } from "@/components/Icons";
import { getServices } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital advertising, social media, websites, SEO, content, WhatsApp marketing, AI automation and more — every service Zirka Digital Solutions offers.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Everything your marketing needs."
        lede="Fourteen services across advertising, social, content, web, SEO, WhatsApp and automation. Take one, or let us run the lot together."
      />

      <section className="section--index">
        <div className="wrap">
          <h2 className="index-heading">All services</h2>
          <ol className="service-index">
            {services.map((service, i) => (
              <li key={service.slug}>
                <a href={`#${service.slug}`}>
                  <span className="service-index__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="service-index__name">{service.name}</span>
                  <span className="service-index__count">
                    {service.capabilities.length} included
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section--flow">
        <div className="wrap">
          {services.map((service) => (
            <div className="service-detail" id={service.slug} key={service.slug}>
              <div className={`plate ${service.plate}`}>
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 860px) 100vw, 220px"
                />
                <ServiceIcon kind={service.icon} />
              </div>
              <div className="content">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="tags">
                  {service.capabilities.map((cap) => (
                    <span className="tag" key={cap}>
                      {cap}
                    </span>
                  ))}
                </div>
                {service.outcomes && <div className="outcome">{service.outcomes}</div>}
                {hasVideo(service.video) && (
                  <VideoEmbed video={service.video} title={service.video.title} />
                )}
                <Link className="explore" href={`/quote?service=${service.slug}`}>
                  Get a quote for this
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand heading="Not sure which mix is right?" />
    </>
  );
}
