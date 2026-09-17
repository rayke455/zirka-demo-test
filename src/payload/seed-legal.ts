/**
 * Starting-point legal text. Deliberately plain and conservative — the team must
 * edit it to match how they actually trade, and have it checked before relying on it.
 * Run with: npx payload run src/payload/seed-legal.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";

const terms = [
  {
    heading: "What we agree",
    body: "Before work starts we send you a written scope: what we will do, what it costs, and when it will be delivered. That scope, together with these terms, forms our agreement. Anything outside it is new work and is quoted separately.",
  },
  {
    heading: "What we need from you",
    body: "We need timely access to the accounts, assets and information the work depends on — for example advertising accounts, brand files, product details and a named person who can approve things.\n\nWhere a delay in getting those pushes the timeline, the deadline moves by roughly the same amount.",
  },
  {
    heading: "Payment",
    body: "Unless your scope says otherwise, projects are invoiced with a deposit before work starts and the balance on delivery. Monthly services are invoiced in advance each month.\n\nAdvertising budget paid to platforms such as Meta or Google is separate from our fees and is paid by you directly wherever possible.",
  },
  {
    heading: "Revisions",
    body: "Each deliverable includes the number of revision rounds stated in your scope. Further rounds, or a change of direction after approval, are charged at our normal rate.",
  },
  {
    heading: "Approval and publishing",
    body: "You approve content before it is published. Once you approve something, you are responsible for its accuracy — including prices, claims, offers and any regulated wording in your industry.",
  },
  {
    heading: "Ownership",
    body: "When you have paid in full, you own the final deliverables we created for you. We keep ownership of our own tools, templates and working files.\n\nWe would like to show the work in our portfolio. Tell us if you would prefer we did not, and we will keep it private.",
  },
  {
    heading: "Results",
    body: "We apply professional skill and experience, but marketing results depend on factors outside our control — your market, your pricing, platform algorithms and competitors among them. We do not guarantee specific results, rankings, revenue or return unless a particular guarantee is written into your scope.",
  },
  {
    heading: "Confidentiality",
    body: "We keep your business information confidential and share it only with the people working on your account.",
  },
  {
    heading: "Ending the agreement",
    body: "Either of us may end a monthly service with 30 days' written notice. You are charged for the notice period and for any work already delivered.\n\nWe may pause or end work if invoices remain unpaid, or if we are asked to do something unlawful or misleading.",
  },
  {
    heading: "Liability",
    body: "Our total liability for any claim connected to our work is limited to the fees you paid us for the work that claim relates to. We are not liable for indirect losses such as lost profit or lost data.",
  },
  {
    heading: "Changes to these terms",
    body: "We may update these terms. The version that applies to your project is the one in force when your scope was agreed.",
  },
];

const refunds = [
  {
    heading: "Deposits",
    body: "Deposits reserve your place in our schedule and cover the planning and setup that begins immediately. Once work has started, deposits are not refundable.\n\nIf you cancel before any work has begun, we refund the deposit in full.",
  },
  {
    heading: "Project work",
    body: "If you cancel part-way through a project, we invoice for the work completed and any costs already committed, and refund the rest.",
  },
  {
    heading: "Monthly services",
    body: "Monthly services are paid in advance. If you cancel mid-month, that month runs to the end of its term and is not refunded; nothing further is charged after it.",
  },
  {
    heading: "Advertising budget",
    body: "Money spent with advertising platforms is paid to those platforms, not to us, and cannot be refunded by us once spent. Any unspent budget still held by us is returned to you.",
  },
  {
    heading: "If something is wrong",
    body: "If a deliverable does not match the agreed scope, tell us within 14 days of delivery and we will put it right at no extra cost. Where we cannot, we refund the fee for that deliverable.\n\nWe do not refund work that meets the agreed scope but did not produce the commercial result hoped for, since results depend on factors outside our control.",
  },
  {
    heading: "How to ask for a refund",
    body: "Email or message us with your invoice number and what went wrong. We respond within five business days and pay approved refunds by the original payment method within 14 days.",
  },
];

const payload = await getPayload({ config });
const current = (await payload.findGlobal({ slug: "site-settings", depth: 0 })) as unknown as Record<
  string,
  unknown
>;

if (Array.isArray(current.terms) && current.terms.length > 0) {
  console.log("terms already written — left untouched");
} else {
  await payload.updateGlobal({ slug: "site-settings", data: { terms, refunds } });
  console.log(`seeded ${terms.length} terms sections and ${refunds.length} refund sections`);
}
process.exit(0);
