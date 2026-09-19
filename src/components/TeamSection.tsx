import Image from "next/image";
import type { TeamView } from "@/lib/cms";

/**
 * The team (brief §3). Built now, shown only once real people with real
 * photos are published and Features → Leadership is on. Self-contained so it
 * can be placed on the homepage later without a redesign.
 */
export default function TeamSection({ team }: { team: TeamView[] }) {
  if (team.length === 0) return null;
  return (
    <section className="section--flow" id="team">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">The team</span>
            <h2>Small agency. Senior attention.</h2>
          </div>
          <p>
            Work directly with the people responsible for your strategy and execution. No layers of
            account managers, no disappearing salesperson, and no one-size-fits-all marketing plans.
          </p>
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <article className="team-card" key={member.name}>
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
              {member.bio && <p className="team-card__bio">{member.bio}</p>}
              {member.experience && <p className="team-card__experience">{member.experience}</p>}
              {member.certifications.length > 0 && (
                <ul className="team-card__certs" aria-label={`${member.name}'s certifications`}>
                  {member.certifications.map((c) => (
                    <li className="tag" key={c}>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {member.linkedin && (
                <a className="explore" href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
