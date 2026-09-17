import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CtaBand from "@/components/CtaBand";
import WorkCard from "@/components/WorkCard";
import { getCaseStudies } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies and results from Zirka Digital Solutions client engagements.",
};

export default async function WorkPage() {
  const work = await getCaseStudies();

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Results, not just reach."
        lede={
          work.length > 0
            ? "Every engagement below is measured against the same standard: a business metric that moved, not an impression count."
            : "We measure every engagement against the same standard: a business metric that moved, not an impression count."
        }
      />

      <section>
        <div className="wrap">
          {work.length > 0 ? (
            <div className="work-grid wide">
              {work.map((item) => (
                <WorkCard item={item} showSummary key={item.name} />
              ))}
            </div>
          ) : (
            <div className="booking-empty">
              <h2>Case studies coming soon</h2>
              <p>
                We&rsquo;re writing up recent client work. In the meantime, tell us what you&rsquo;re
                trying to achieve and we&rsquo;ll walk you through comparable projects on a call.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand heading="Want results like these?" />
    </>
  );
}
