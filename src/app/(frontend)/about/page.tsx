import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import CtaBand from "@/components/CtaBand";
import { getTeam, getValues } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zirka Digital Solutions was founded in 2019 on the idea that a marketing partner should be a fixed point, not another moving part.",
};

export default async function AboutPage() {
  const [team, values] = await Promise.all([getTeam(), getValues()]);

  return (
    <>
      <PageHeader
        eyebrow="About Zirka"
        title="Named for the one thing sailors never lost."
        lede="Zirka means star. Before GPS, a star was the one reference point a ship could always trust to hold still. That's the job we set out to do for marketing budgets."
      />

      <section>
        <div className="wrap story">
          <div>
            <span className="eyebrow">Our story</span>
            <h2 style={{ marginTop: 10, marginBottom: 18, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
              Founded on a simple complaint.
            </h2>
            <p>
              Zirka started in 2019 after its founder spent six years watching agencies sell
              reach and call it results. Clients kept a dashboard full of impressions and still
              couldn&rsquo;t say whether last quarter&rsquo;s spend paid for itself.
            </p>
            <p>
              So the founding rule was narrow on purpose: every plan gets written back against
              revenue or pipeline before it gets written at all. Channels are a means, not the
              pitch. Seven years and 128 brands later, that rule hasn&rsquo;t moved &mdash; even
              as the channels underneath it have changed completely.
            </p>
            <p>
              Today Zirka runs performance media, SEO, content, and brand &amp; web work for
              clients who&rsquo;ve usually already tried the reach-first version and want the
              other kind.
            </p>
          </div>
          <div className="story-plate">
            <Image
              src="/images/about-office.jpg"
              alt="The Zirka studio floor, with the team working at shared desks"
              fill
              sizes="(max-width: 860px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="section--flow">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">How we think</span>
              <h2>Three rules that don&rsquo;t bend.</h2>
            </div>
            <p>Every client gets the same operating principles, regardless of budget size.</p>
          </div>
          <div className="approach values">
            {values.map((value) => (
              <div className="step" key={value.name}>
                <h3 style={{ marginTop: 0 }}>{value.name}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--flow">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Leadership</span>
              <h2>Senior hands on every account.</h2>
            </div>
            <p>The people who run strategy in month one are the same people running it in month twelve.</p>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.name}>
                <div className="portrait">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} at Zirka`}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 860px) 50vw, 25vw"
                  />
                </div>
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand heading="Want to meet the team?" />
    </>
  );
}
