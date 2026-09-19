import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LegalBody from "@/components/LegalBody";
import { getLegal } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Refund policy",
  description:
    "Our refund policy in plain language: when work carried out by Zirka Digital Solutions is refundable, and when it isn't.",
  path: "/refunds",
});

export default async function RefundsPage() {
  const legal = await getLegal();

  return (
    <>
      <PageHeader eyebrow="Refund policy" title="Deposits and refunds." lede={legal.refundsIntro} />
      <section>
        <div className="wrap prose">
          <LegalBody
            sections={legal.refunds}
            entity={legal.entity}
            jurisdiction={legal.jurisdiction}
          />
        </div>
      </section>
    </>
  );
}
