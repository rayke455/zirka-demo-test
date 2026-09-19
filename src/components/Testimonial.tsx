import Image from "next/image";
import Link from "next/link";
import { getTestimonials, type TestimonialView } from "@/lib/cms";
import { ArrowIcon } from "./Icons";

/**
 * Genuine client testimonials (brief §7). One is shown as a large quote,
 * several as cards. When none are published the section is not rendered at
 * all — never an empty card to fill the page.
 */
export default async function Testimonial() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  if (testimonials.length === 1) {
    const t = testimonials[0];
    return (
      <section className="testimonial-band">
        <div className="wrap">
          <figure>
            <span className="quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote>{t.quote}</blockquote>
            <Attribution t={t} />
          </figure>
        </div>
      </section>
    );
  }

  return (
    <section className="section--flow testimonials">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">In their words</span>
            <h2>What clients say.</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <figure className="testimonial-card" key={`${t.name}-${t.company}`}>
              {t.logo && (
                <Image className="testimonial-card__logo" src={t.logo} alt={t.company} width={120} height={40} />
              )}
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <Attribution t={t} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Attribution({ t }: { t: TestimonialView }) {
  return (
    <figcaption>
      {t.photo && (
        <Image className="testimonial__photo" src={t.photo} alt="" width={48} height={48} />
      )}
      <span className="who">{t.name}</span>
      <span className="where">{[t.role, t.company].filter(Boolean).join(", ")}</span>
      {t.result && <span className="testimonial__result">{t.result}</span>}
      {t.caseStudy && (
        <Link className="explore" href={`/work/${t.caseStudy.slug}`}>
          Read the case study
          <ArrowIcon />
        </Link>
      )}
    </figcaption>
  );
}
