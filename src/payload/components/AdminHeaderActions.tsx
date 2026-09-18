import LogoutButton from "./LogoutButton";

/**
 * Rendered in Payload's global admin top bar on every page.
 * Provides instant access to the live website and a quick logout action.
 */
export default function AdminHeaderActions() {
  return (
    <div className="zk-header-actions">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="zk-header-btn zk-header-btn--site"
        title="View live website in a new tab"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>Live Site</span>
      </a>
      <LogoutButton variant="header" />
    </div>
  );
}
