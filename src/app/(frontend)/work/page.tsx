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
  // Only claim measured outcomes when there is real, documented work to back it.
  const hasRealWork = work.some((w) => !w.sample);

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title={hasRealWork ? "Results, not just reach." : "How we approach the work."}
        lede={
          hasRealWork
            ? "Real client work is measured against one standard: a business metric that moved, not an impression count. Anything marked Concept Project shows our thinking, not a client result."
            : "These are concept projects: they show the strategy and creative direction we bring, not work for real clients, and they claim no results. Client case studies will appear here as they are completed."
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
