import { getFeaturedTestimonial } from "@/lib/cms";

export default async function Testimonial() {
  const testimonial = await getFeaturedTestimonial();
  if (!testimonial) return null;

  return (
    <section className="testimonial-band">
      <div className="wrap">
        <figure>
          <span className="quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption>
            <span className="who">{testimonial.name}</span>
            <span className="where">
              {[testimonial.role, testimonial.company].filter(Boolean).join(", ")}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
