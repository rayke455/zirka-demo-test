type Row = { path: string; views: number };

export default function TopPages({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <div className="zk-card">
        <div className="zk-card__head">
          <h3>Most visited pages</h3>
        </div>
        <p className="zk-empty">Nothing to rank yet.</p>
      </div>
    );
  }

  const max = Math.max(...rows.map((r) => r.views));

  return (
    <div className="zk-card">
      <div className="zk-card__head">
        <h3>Most visited pages</h3>
        <span className="zk-card__note">Last 30 days</span>
      </div>
      <ul className="zk-bars">
        {rows.map((r) => (
          <li key={r.path}>
            <span className="zk-bars__label">{r.path === "/" ? "/ (home)" : r.path}</span>
            <span className="zk-bars__track">
              <span
                className="zk-bars__fill"
                style={{ width: `${Math.max(2, (r.views / max) * 100)}%` }}
              />
            </span>
            <span className="zk-bars__value">{r.views.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
