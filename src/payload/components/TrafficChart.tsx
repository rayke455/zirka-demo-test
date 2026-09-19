type Day = { date: string; label: string; views: number };

const W = 720;
const H = 200;
const PAD = { top: 16, right: 12, bottom: 26, left: 38 };

/** Nice round ceiling so the axis labels name values the chart actually reaches. */
const niceMax = (v: number) => {
  if (v <= 4) return 4;
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / mag) * mag;
};

export default function TrafficChart({ days }: { days: Day[] }) {
  const total = days.reduce((a, d) => a + d.views, 0);

  if (total === 0) {
    return (
      <div className="zk-card">
        <div className="zk-card__head">
          <h3>Page views</h3>
          <span className="zk-card__note">Last 30 days</span>
        </div>
        <p className="zk-empty">
          No visits recorded yet. Data appears here once people start browsing the site.
        </p>
      </div>
    );
  }

  const max = niceMax(Math.max(...days.map((d) => d.views)));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (plotW * i) / Math.max(1, days.length - 1);
  const y = (v: number) => PAD.top + plotH - (plotH * v) / max;

  const line = days.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.views)}`).join(" ");
  const area = `${line} L${x(days.length - 1)},${PAD.top + plotH} L${PAD.left},${PAD.top + plotH} Z`;

  const ticks = [0, max / 2, max];
  // Label only the ends and the peak, never every point.
  const peak = days.reduce((b, d, i) => (d.views > days[b].views ? i : b), 0);
  const labelled = new Set([0, days.length - 1, peak]);
  // The peak's date is only printed when it is far enough from both ends not
  // to overlap their dates; its dot always shows.
  const last = days.length - 1;
  const showDate = (i: number) => i === 0 || i === last || (i >= 5 && i <= last - 5);
  const anchor = (i: number) => (i === 0 ? "start" : i === last ? "end" : "middle");

  return (
    <div className="zk-card">
      <div className="zk-card__head">
        <h3>Page views</h3>
        <span className="zk-card__note">
          {total.toLocaleString()} in the last 30 days
        </span>
      </div>

      <svg
        className="zk-chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Page views per day over the last 30 days, ${total} in total`}
        preserveAspectRatio="none"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className="zk-grid"
              shapeRendering="crispEdges"
            />
            <text x={PAD.left - 8} y={y(t) + 4} className="zk-axis" textAnchor="end">
              {Math.round(t)}
            </text>
          </g>
        ))}

        <path d={area} className="zk-area" />
        <path d={line} className="zk-line" />

        {days.map((d, i) =>
          labelled.has(i) ? (
            <g key={d.date}>
              <circle cx={x(i)} cy={y(d.views)} r={4} className="zk-dot" />
              {showDate(i) && (
                <text x={x(i)} y={H - 8} className="zk-axis" textAnchor={anchor(i)}>
                  {d.label}
                </text>
              )}
            </g>
          ) : null
        )}

        {/* Native tooltips: hover any day without shipping a JS layer. */}
        {days.map((d, i) => (
          <rect
            key={`hit-${d.date}`}
            x={x(i) - plotW / days.length / 2}
            y={PAD.top}
            width={plotW / days.length}
            height={plotH}
            fill="transparent"
          >
            <title>{`${d.label}: ${d.views} view${d.views === 1 ? "" : "s"}`}</title>
          </rect>
        ))}
      </svg>
    </div>
  );
}
