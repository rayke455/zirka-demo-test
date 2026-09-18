import LogoutButton from "./LogoutButton";

/**
 * Rendered at the bottom of the sidebar nav links.
 * Provides a persistent, sticky footer on every admin page.
 */
export default function AfterNavLinks() {
  return (
    <div className="zk-nav-footer">
      <div className="zk-nav-footer__head">
        <span className="zk-nav-footer__title">Session</span>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="zk-nav-footer__site-btn"
          title="Open live website in a new tab"
        >
          <span>Live Site</span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
      <LogoutButton variant="sidebar" />
    </div>
  );
}
