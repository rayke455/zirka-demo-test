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
        lede="Every engagement below is measured against the same standard: a business metric that moved, not an impression count."
      />

      <section>
        <div className="wrap">
          <div className="work-grid wide">
            {work.map((item) => (
              <WorkCard item={item} showSummary key={item.name} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand heading="Want results like these?" />
    </>
  );
}
