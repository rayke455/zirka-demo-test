import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import CtaBand from "@/components/CtaBand";
import { getTeam, getValues, getFeatures, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
  description: "Who Zirka Digital Solutions is and how we work.",
};

export default async function AboutPage() {
  const [team, values, features, settings] = await Promise.all([
    getTeam(),
    getValues(),
    getFeatures(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader eyebrow="About Zirka" title={settings.aboutTitle} lede={settings.aboutLede} />

      {settings.story.length > 0 && (
        <section>
          <div className="wrap story">
            <div>
              <span className="eyebrow">Our story</span>
              <h2 style={{ marginTop: 10, marginBottom: 18, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
                {settings.storyHeading}
              </h2>
              {settings.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="story-plate">
              <Image
                src={settings.storyImage}
                alt={settings.storyAlt}
                fill
                sizes="(max-width: 860px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>
      )}

      {features.showValues && values.length > 0 && (
        <section className={settings.story.length > 0 ? "section--flow" : undefined}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">How we think</span>
                <h2>What we stand by.</h2>
              </div>
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
      )}

      {features.showLeadership && team.length > 0 && (
        <section className="section--flow">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">The team</span>
                <h2>The people you&rsquo;ll work with.</h2>
              </div>
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
      )}

      <CtaBand heading="Want to work together?" />
    </>
  );
}
