import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import StarField from "@/components/StarField";
import { WhatsAppIcon } from "@/components/Icons";
import ServiceCard from "@/components/ServiceCard";
import WorkCard from "@/components/WorkCard";
import WorkFeature from "@/components/WorkFeature";
import Testimonial from "@/components/Testimonial";
import Engagements from "@/components/Engagements";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { getServices, getCaseStudies, getSettings, getProcessSteps } from "@/lib/cms";

/** Split the headline so the emphasised word can carry the accent colour. */
function Headline({ text, emphasis }: { text: string; emphasis: string }) {
  if (!emphasis || !text.toLowerCase().includes(emphasis.toLowerCase())) return <h1>{text}</h1>;
  const at = text.toLowerCase().indexOf(emphasis.toLowerCase());
  return (
    <h1>
      {text.slice(0, at)}
      <em>{text.slice(at, at + emphasis.length)}</em>
      {text.slice(at + emphasis.length)}
    </h1>
  );
}

export default async function Home() {
  const [settings, services, work, steps] = await Promise.all([
    getSettings(),
    getServices(),
    getCaseStudies(),
    getProcessSteps(),
  ]);

  return (
    <>
      {/* 1 — Hook: who we are and the one line that matters */}
      <div className="hero">
        <Image
          className="hero-photo"
          src={settings.heroImage}
          alt={settings.heroAlt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
        />
        <StarField />
        <div className="wrap">
          <Header />
          <div className="hero-inner">
            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
              {settings.descriptor}
            </span>
            <Headline text={settings.heroHeadline} emphasis={settings.heroEmphasis} />
            <p className="lede">{settings.heroLede}</p>
            <div className="hero-ctas">
              <Link className="btn btn-gold" href="/contact">
                Book a strategy call
              </Link>
              <a
                className="btn btn-ghost"
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                Message us on WhatsApp
              </a>
            </div>
            {settings.stats.length > 0 && (
              <div className="stat-strip">
                {settings.stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <span className="num">{s.num}</span>
                    <span className="label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 — Credibility */}
      {settings.trustedBy.length > 0 && (
        <div className="trusted">
          <div className="wrap trusted-row">
            <span className="trusted-label">Trusted by growing brands &mdash;</span>
            <div className="trusted-names">
              {settings.trustedBy.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3 — What we do */}
      {services.length > 0 && (
        <section id="services">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">What we do</span>
                <h2>Four disciplines, one trajectory.</h2>
              </div>
              <p>
                Every engagement starts with the same question: what actually moves revenue for
                this brand? The service mix follows the answer.
              </p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <ServiceCard service={service} key={service.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4 — Proof that it works */}
      {work.length > 0 && (
        <section id="work" className="section--flow">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Selected work</span>
                <h2>Results, not just reach.</h2>
              </div>
              <p>A sample of engagements and the numbers behind them.</p>
            </div>
            <WorkFeature item={work[0]} />
            <div className="work-grid wide">
              {work.slice(1, 4).map((item) => (
                <WorkCard item={item} key={item.name} />
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link className="btn btn-outline" href="/work">
                View all work
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5 — Proof in a client's own words */}
      <Testimonial />

      {/* 6 — How the work actually runs */}
      {steps.length > 0 && (
        <section id="approach" className="section--panel">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">How we work</span>
                <h2>The same route, every time.</h2>
              </div>
              <p>
                Run in order on every engagement &mdash; from first audit to the optimization loop
                that never really ends.
              </p>
            </div>
            <div className="approach">
              {steps.map((step) => (
                <div className="step" key={step.name}>
                  <span className="idx">{step.idx}</span>
                  <h3>{step.name}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7 — What it costs */}
      <Engagements />

      {/* 8 — The objections that stop people calling */}
      <Faq />

      {/* 9 — Act */}
      <CtaBand />
    </>
  );
}
