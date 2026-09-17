import Link from "next/link";
import { getEngagements } from "@/lib/cms";
import { ArrowIcon } from "./Icons";

export default async function Engagements() {
  const engagements = await getEngagements();
  if (engagements.length === 0) return null;

  return (
    <section id="pricing">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">How we engage</span>
            <h2>Three ways to work together.</h2>
          </div>
          <p>
            Every engagement is scoped to the business, but it usually starts from one of these
            three shapes.
          </p>
        </div>

        <div className="tier-grid">
          {engagements.map((tier) => (
            <article className={`tier${tier.featured ? " featured" : ""}`} key={tier.name}>
              {tier.featured && <span className="tier-badge">Most common</span>}
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
              <Link className="explore" href="/contact">
                Start here
                <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>

        <p className="tier-note">
          Not sure which fits? Tell us the number you&rsquo;re trying to move and we&rsquo;ll
          recommend the smallest engagement that gets you there.
        </p>
      </div>
    </section>
  );
}
