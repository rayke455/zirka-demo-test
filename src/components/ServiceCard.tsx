import Link from "next/link";
import Image from "next/image";
import type { ServiceView } from "@/lib/cms";
import { ServiceIcon, ArrowIcon } from "./Icons";

export default function ServiceCard({ service }: { service: ServiceView }) {
  return (
    <article className="service-card">
      <div className={`plate ${service.plate}`}>
        <Image src={service.image} alt={service.alt} fill sizes="(max-width: 860px) 100vw, 50vw" />
        <ServiceIcon kind={service.icon} />
      </div>
      <div className="service-body">
        <h3>{service.name}</h3>
        <p>{service.short}</p>
        <div className="tags">
          {service.capabilities.map((cap) => (
            <span className="tag" key={cap}>
              {cap}
            </span>
          ))}
        </div>
        <Link className="explore" href={`/services#${service.slug}`}>
          Explore {service.name.split(" ")[0].toLowerCase()}
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
