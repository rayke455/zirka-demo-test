import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "../(frontend)/globals.css";

// Same family as the main site, so the notice still looks like Zirka.
const urbanist = Urbanist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  // The notice is never a page of its own in search results.
  robots: { index: false, follow: false },
};

/**
 * A bare layout for the maintenance notice: no header or footer, whose links
 * would only lead back to the notice while the site is closed.
 */
export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body className="maintenance-body">{children}</body>
    </html>
  );
}
