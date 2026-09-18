/**
 * Who Zirka works with (brief §6). The industry tags come from Site Settings
 * and only appear once someone adds them — the brief is explicit that no
 * specialism should be invented to fill the space.
 */
export default function WhoWeHelp({
  heading,
  body,
  industries,
}: {
  heading: string;
  body: string;
  industries: string[];
}) {
  return (
    <section id="who-we-help" className="section--flow">
      <div className="wrap">
        <div className="who-we-help">
          <span className="eyebrow">Who we help</span>
          <h2>{heading}</h2>
          <p>{body}</p>
          {industries.length > 0 && (
            <ul className="who-we-help__industries" aria-label="Industries we work with">
              {industries.map((name) => (
                <li className="tag" key={name}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
