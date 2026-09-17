import Link from "next/link";
import Header from "./Header";

export default function NotFoundContent() {
  return (
    <div className="page-header not-found">
      <div className="wrap">
        <Header />
        <div className="page-header-inner not-found__inner">
          <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
            Error 404
          </span>
          <h1>This page has drifted off course.</h1>
          <p className="lede">
            The link may be old, or the address mistyped. Here&rsquo;s where you can pick the route
            back up.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-gold" href="/">
              Back to the homepage
            </Link>
            <Link className="btn btn-ghost" href="/work">
              See our work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
