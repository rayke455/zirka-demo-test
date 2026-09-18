/**
 * The goals offered on the free-audit form. Shared by the form and its server
 * action, which rejects anything not on this list.
 */
export const AUDIT_GOALS = [
  "Get more leads or enquiries",
  "Show up on Google and Google Maps",
  "Get better results from paid ads",
  "Improve or rebuild our website",
  "Build our brand and social presence",
  "Automate follow-up and customer replies",
  "Something else",
] as const;
