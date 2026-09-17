import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import CtaBand from "@/components/CtaBand";
import { ServiceIcon } from "@/components/Icons";
import { getServices } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Performance marketing, SEO, social & content, and brand & web experience — the four disciplines Zirka runs for every client.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Four disciplines. One trajectory."
        lede="Every retainer draws from the same four capabilities — mixed differently for a launch than for a mature brand defending market share."
      />

      <section>
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
                <div className="outcome">{service.outcomes}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand heading="Not sure which mix is right?" />
    </>
  );
}
