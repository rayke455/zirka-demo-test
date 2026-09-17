import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import NotFoundContent from "@/components/NotFoundContent";
import "./(frontend)/globals.css";

// This page bypasses every layout, so it must bring its own font and styles.
const urbanist = Urbanist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Page not found | Zirka Digital Solutions",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={urbanist.variable}>
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
