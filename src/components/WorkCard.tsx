import Image from "next/image";
import Link from "next/link";
import type { WorkView } from "@/lib/cms";

export default function WorkCard({ item, showSummary }: { item: WorkView; showSummary?: boolean }) {
  return (
    <Link className={`work-card ${item.plate}`} href={`/work/${item.slug}`}>
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 480px) 100vw, (max-width: 860px) 50vw, 33vw"
      />
      <span className="work-tag">{item.category}</span>
      {/* A concept is labelled, and never shows a result figure (brief §4). */}
      {item.sample && <span className="work-sample">Concept Project</span>}
      <div className="work-info">
        <h3>{item.name}</h3>
        {!item.sample && <span className="work-metric">{item.metric}</span>}
        {showSummary && <p className="work-summary">{item.summary}</p>}
      </div>
    </Link>
  );
}
