export type LegalSection = { heading: string; body: string };

export default function LegalBody({
  sections,
  entity,
  jurisdiction,
}: {
  sections: LegalSection[];
  entity: string;
  jurisdiction: string;
}) {
  if (sections.length === 0) {
    return (
      <p className="prose__meta">
        This page hasn&rsquo;t been written yet. Please get in touch and we&rsquo;ll send you our
        current terms.
      </p>
    );
  }

  return (
    <>
      {sections.map((s) => (
        <div key={s.heading}>
          <h2>{s.heading}</h2>
          {s.body
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
      ))}
      <p className="prose__meta">
        {entity ? `${entity}. ` : ""}
        {jurisdiction ? `Governed by the laws of ${jurisdiction}.` : ""}
      </p>
    </>
  );
}
