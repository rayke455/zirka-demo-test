import type { ReactNode } from "react";
import Header from "./Header";

export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
}) {
  return (
    <div className="page-header">
      <div className="wrap">
        <Header />
        <div className="page-header-inner">
          <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
            {eyebrow}
          </span>
          <h1>{title}</h1>
          <p className="lede">{lede}</p>
        </div>
      </div>
    </div>
  );
}
