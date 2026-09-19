import type { Field } from "payload";

/** Stages a lead can be in. "open" and "closed" keep their stored values from before the tracker. */
export const LEAD_STAGES = {
  enquiry: [
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "In conversation", value: "open" },
    { label: "Proposal sent", value: "proposal" },
    { label: "Won", value: "won" },
    { label: "Lost / closed", value: "closed" },
  ],
  quote: [
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Quote sent", value: "quoted" },
    { label: "Won", value: "won" },
    { label: "Lost / closed", value: "closed" },
  ],
};

/**
 * Everything that still needs work: not yet won or closed. Each list is kept to
 * its own collection's stages: Postgres rejects a filter on a stage the
 * collection doesn't have, rather than just matching nothing.
 */
const openOf = (stages: { value: string }[]) =>
  stages.map((s) => s.value).filter((v) => v !== "won" && v !== "closed");
export const OPEN_STAGES = { submissions: openOf(LEAD_STAGES.enquiry), quotes: openOf(LEAD_STAGES.quote) };

/**
 * The lead tracker sidebar shared by enquiries and quote requests: where the
 * lead stands, when to chase it, and what it was worth when won.
 */
export const leadFields = (stages: { label: string; value: string }[]): Field[] => [
  {
    name: "status",
    label: "Stage",
    type: "select",
    defaultValue: "new",
    index: true,
    options: stages,
    admin: { position: "sidebar" },
  },
  {
    name: "followUp",
    label: "Follow up on",
    type: "date",
    index: true,
    admin: {
      position: "sidebar",
      date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      description: "The dashboard reminds you on this day.",
    },
  },
  {
    name: "dealValue",
    label: "Deal value (USD)",
    type: "number",
    min: 0,
    admin: {
      position: "sidebar",
      description: "What this client is worth, e.g. the first month plus any project fee. Counts toward “Won this month” on the dashboard.",
      condition: (data) => data?.status === "won",
    },
  },
  {
    // Stamped when the stage changes to Won, so "Won this month" counts the
    // month the deal closed rather than the month the form was sent.
    name: "wonAt",
    label: "Won on",
    type: "date",
    admin: { position: "sidebar", readOnly: true, condition: (data) => data?.status === "won" },
    hooks: {
      beforeChange: [
        ({ value, siblingData, originalDoc }) => {
          // A partial update may not include the stage, so fall back to the saved one.
          const status = siblingData?.status ?? originalDoc?.status;
          if (status !== "won") return null;
          if (originalDoc?.status !== "won" || !value) return new Date().toISOString();
          return value;
        },
      ],
    },
  },
  {
    name: "notes",
    type: "textarea",
    admin: {
      description: "Internal only, never shown on the website. Calls, what was agreed, next steps.",
      rows: 6,
    },
  },
];
