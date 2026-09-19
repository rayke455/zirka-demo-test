import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LegalBody from "@/components/LegalBody";
import { getLegal } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms of service",
  description:
    "The terms that apply when you work with Zirka Digital Solutions: scope, payment, ownership, and what each of us can expect.",
  path: "/terms",
});

export default async function TermsPage() {
  const legal = await getLegal();

  return (
    <>
      <PageHeader
        eyebrow="Terms of service"
        title="How we work together."
        lede={legal.termsIntro}
      />
      <section>
        <div className="wrap prose">
          <LegalBody sections={legal.terms} entity={legal.entity} jurisdiction={legal.jurisdiction} />
        </div>
      </section>
    </>
  );
}
