/**
 * The website's colour themes. The full colour sets (light and dark) live in
 * app/(frontend)/globals.css under :root[data-site-theme="…"]; these are the
 * names and preview colours the admin's theme picker shows.
 */
export const SITE_THEMES = [
  {
    id: "emerald",
    name: "Emerald & Copper",
    description: "The original Zirka look: deep green with warm copper. Calm and premium.",
    hero: "#0a2c1f",
    accent: "#b87333",
    secondary: "#1f6b4e",
    paper: "#f6f3ea",
    card: "#fffdf7",
    line: "rgba(14, 42, 32, 0.14)",
  },
  {
    id: "midnight",
    name: "Midnight & Gold",
    description: "Navy with soft gold. Corporate, trustworthy and classic.",
    hero: "#0f1c33",
    accent: "#c9a24a",
    secondary: "#2c4a7a",
    paper: "#f4f3ef",
    card: "#ffffff",
    line: "rgba(17, 26, 43, 0.14)",
  },
  {
    id: "onyx",
    name: "Onyx & Tangerine",
    description: "Charcoal black with bold orange. Modern, energetic and confident.",
    hero: "#151515",
    accent: "#ff6b35",
    secondary: "#3d3d3d",
    paper: "#f6f6f4",
    card: "#ffffff",
    line: "rgba(22, 22, 22, 0.14)",
  },
  {
    id: "plum",
    name: "Plum & Rose Gold",
    description: "Deep aubergine with rose gold. Elegant, creative and distinctive.",
    hero: "#2a1330",
    accent: "#d4907a",
    secondary: "#6b3a74",
    paper: "#f8f4f1",
    card: "#fffcfa",
    line: "rgba(38, 20, 43, 0.14)",
  },
] as const;

export type SiteThemeId = (typeof SITE_THEMES)[number]["id"];

export const isSiteTheme = (value: unknown): value is SiteThemeId =>
  SITE_THEMES.some((t) => t.id === value);
