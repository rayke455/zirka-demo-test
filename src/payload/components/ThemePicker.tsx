"use client";

import { useField } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";
import { SITE_THEMES } from "../../lib/site-themes";

/**
 * Features → Theme: the four site themes as clickable cards, each a small
 * preview of the hero, a card and the main button in that theme's colours.
 */
const ThemePicker: SelectFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path });
  const current = value || "emerald";

  return (
    <div className="zk-themes">
      <p className="zk-themes__intro">
        Pick the colours for your whole website. Press <strong>Save</strong> and the site changes
        straight away. Visitors who use dark mode get the dark version of the same theme.
      </p>
      <div className="zk-themes__grid" role="radiogroup" aria-label="Website theme">
        {SITE_THEMES.map((t) => {
          const selected = current === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`zk-theme${selected ? " zk-theme--selected" : ""}`}
              onClick={() => setValue(t.id)}
            >
              <span className="zk-theme__preview" style={{ background: t.paper }}>
                <span className="zk-theme__hero" style={{ background: t.hero }}>
                  <span className="zk-theme__line" style={{ background: t.accent, width: "34%" }} />
                  <span className="zk-theme__line" style={{ background: "#f2efe6", width: "70%", opacity: 0.9 }} />
                  <span className="zk-theme__line" style={{ background: "#f2efe6", width: "52%", opacity: 0.55 }} />
                  <span className="zk-theme__btn" style={{ background: t.accent }} />
                </span>
                <span className="zk-theme__cards">
                  <span className="zk-theme__card" style={{ background: t.card, borderColor: t.line }}>
                    <span className="zk-theme__dot" style={{ background: t.accent }} />
                  </span>
                  <span className="zk-theme__card" style={{ background: t.card, borderColor: t.line }}>
                    <span className="zk-theme__dot" style={{ background: t.secondary }} />
                  </span>
                </span>
              </span>
              <span className="zk-theme__meta">
                <span className="zk-theme__name">
                  {t.name}
                  {selected && <span className="zk-theme__badge">Selected</span>}
                </span>
                <span className="zk-theme__desc">{t.description}</span>
                <span className="zk-theme__swatches" aria-hidden="true">
                  {[t.hero, t.accent, t.secondary, t.paper].map((c) => (
                    <span key={c} style={{ background: c }} />
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePicker;
