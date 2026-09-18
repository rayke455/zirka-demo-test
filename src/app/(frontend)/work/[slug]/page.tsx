import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CtaBand from "@/components/CtaBand";
import { ArrowIcon } from "@/components/Icons";
import { getCaseStudy } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Case study not found" };
  return {
    title: `${study.name} — ${study.metric}`,
    description: study.summary,
    openGraph: { images: [{ url: study.heroImage }] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  // Show the stored result strip, or fall back to the card's headline number.
  const results =
    study.results.length > 0 ? study.results : [{ value: study.metric, label: study.category }];

  const chapters = [
    { heading: "The challenge", body: study.challenge },
    { heading: "What we did", body: study.approach },
    { heading: "What changed", body: study.outcome },
  ].filter((c) => c.body.trim() !== "");

  return (
    <>
      <div className={`case-hero ${study.plate}`}>
        <Image
          className="case-hero__photo"
          src={study.heroImage}
          alt={study.alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="wrap">
          <Header />
          <div className="case-hero__inner">
            <Link className="case-back" href="/work">
              <ArrowIcon /> All work
            </Link>
            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
              {study.category}
            </span>
            <h1>{study.name}</h1>
            <p className="lede">{study.summary}</p>
          </div>
        </div>
      </div>

      <section className="case-results-wrap">
        <div className="wrap">
          <dl className="case-results">
            {results.map((r) => (
              <div key={`${r.value}-${r.label}`}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {chapters.length > 0 && (
        <section className="section--flow">
          <div className="wrap case-body">
            {chapters.map((c) => (
              <div className="case-chapter" key={c.heading}>
                <h2>{c.heading}</h2>
                {c.body
                  .split(/\n\s*\n/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            ))}

            {study.servicesUsed.length > 0 && (
              <div className="case-chapter">
                <h2>Services on this engagement</h2>
                <div className="tags">
                  {study.servicesUsed.map((s) => (
                    <Link className="tag" key={s.slug} href={`/services/${s.slug}`}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <CtaBand heading="Want a result like this?" />
    </>
  );
}
