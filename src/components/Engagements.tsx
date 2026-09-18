import Link from "next/link";
import { getEngagements, getProjectPricing, getSettings } from "@/lib/cms";
import { ArrowIcon } from "./Icons";

export default async function Engagements() {
  const [engagements, projects, settings] = await Promise.all([
    getEngagements(),
    getProjectPricing(),
    getSettings(),
  ]);
  if (engagements.length === 0 && projects.length === 0) return null;

  return (
    <section id="pricing">
      <div className="wrap">
        {engagements.length > 0 && (
          <>
            <div className="section-head">
              <div>
                <span className="eyebrow">Monthly plans</span>
                <h2>Marketing that scales with you.</h2>
              </div>
              <p>
                Start where your business is today and move up when the results justify it. Every
                plan is a starting point — we scope the detail around your goals.
              </p>
            </div>

            <div className="tier-grid">
              {engagements.map((tier) => (
                <article className={`tier${tier.featured ? " featured" : ""}`} key={tier.name}>
                  {tier.featured && <span className="tier-badge">Most popular</span>}
                  <h3>{tier.name}</h3>
                  <div className="tier-price">
                    <span className="amount">{tier.price}</span>
                    <span className="cadence">{tier.cadence}</span>
                  </div>
                  <p className="tier-summary">{tier.summary}</p>
                  <ul className="tier-list">
                    {tier.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <Link className="explore" href="/quote">
                    Get started
                    <ArrowIcon />
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}

        {projects.length > 0 && (
          <div className="project-pricing">
            <div className="section-head">
              <div>
                <span className="eyebrow">One-off projects</span>
                <h2>Need a single piece of work?</h2>
              </div>
              <p>
                Not every business needs a monthly plan. These are priced per project, with no
                retainer attached.
              </p>
            </div>

            <ul className="project-price-list">
              {projects.map((p) => (
                <li key={p.name}>
                  <span className="project-price-list__name">
                    {p.name}
                    {p.note && <span className="project-price-list__note">{p.note}</span>}
                  </span>
                  <span className="project-price-list__price">{p.price}</span>
                </li>
              ))}
            </ul>

            <p className="tier-note">{settings.projectPricingNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
