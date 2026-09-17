/**
 * Loads the placeholder content into a fresh database so the admin isn't empty
 * on first login. Safe to re-run: it skips anything that already exists.
 * Run with: npm run seed
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { seedServices } from "./seed-services";
import {
  services,
  work,
  team,
  faqs,
  engagements,
  testimonial,
  stats,
  trustedNames,
  steps,
  values,
} from "../lib/data";

{
  const payload = await getPayload({ config });

  const count = async (collection: string) => {
    const { totalDocs } = await payload.find({
      collection: collection as never,
      limit: 0,
      depth: 0,
    });
    return totalDocs;
  };

  const published = { _status: "published" as const };

  if ((await count("services")) === 0) {
    await seedServices(payload);
    console.log(`seeded ${services.length} services`);
  }

  if ((await count("case-studies")) === 0) {
    for (const [i, w] of work.entries()) {
      await payload.create({
        collection: "case-studies",
        data: {
          ...published,
          name: w.name,
          category: w.category,
          metric: w.metric,
          summary: w.summary,
          order: i,
          accent: w.plate,
        },
      });
    }
    console.log(`seeded ${work.length} case studies`);
  }

  if ((await count("team-members")) === 0) {
    for (const [i, m] of team.entries()) {
      await payload.create({
        collection: "team-members",
        data: { ...published, name: m.name, role: m.role, order: i },
      });
    }
    console.log(`seeded ${team.length} team members`);
  }

  if ((await count("process-steps")) === 0) {
    for (const [i, s] of steps.entries()) {
      await payload.create({
        collection: "process-steps",
        data: { ...published, name: s.name, description: s.description, order: i },
      });
    }
    console.log(`seeded ${steps.length} process steps`);
  }

  if ((await count("values")) === 0) {
    for (const [i, v] of values.entries()) {
      await payload.create({
        collection: "values",
        data: { ...published, name: v.name, description: v.description, order: i },
      });
    }
    console.log(`seeded ${values.length} values`);
  }

  if ((await count("faqs")) === 0) {
    for (const [i, f] of faqs.entries()) {
      await payload.create({
        collection: "faqs",
        data: { ...published, question: f.q, answer: f.a, order: i },
      });
    }
    console.log(`seeded ${faqs.length} FAQs`);
  }

  if ((await count("engagements")) === 0) {
    for (const [i, e] of engagements.entries()) {
      await payload.create({
        collection: "engagements",
        data: {
          ...published,
          name: e.name,
          price: e.price,
          cadence: e.cadence,
          summary: e.summary,
          includes: e.includes.map((label) => ({ label })),
          order: i,
          featured: Boolean(e.featured),
        },
      });
    }
    console.log(`seeded ${engagements.length} pricing tiers`);
  }

  // Seeded as a DRAFT on purpose: this quote is placeholder copy and must not
  // appear on the live site until a real client has actually given one.
  if ((await count("testimonials")) === 0) {
    await payload.create({
      collection: "testimonials",
      data: {
        _status: "draft",
        quote: testimonial.quote,
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        featured: true,
      },
    });
    console.log("seeded 1 testimonial (as draft — replace before publishing)");
  }

  // Never overwrite settings the team has already edited.
  const existing = await payload.findGlobal({ slug: "site-settings", depth: 0 });
  if (existing.heroLede) {
    console.log("site settings already set — left untouched");
  } else await payload.updateGlobal({
    slug: "site-settings",
    data: {
      companyName: "Zirka Digital Solutions",
      slogan: "Where Ideas Become Impact",
      descriptor: "Digital Marketing Agency",
      heroHeadline: "Where ideas become impact.",
      heroEmphasis: "impact",
      heroLede:
        "Zirka is the north star for brands navigating a noisy market. We plan the route, then drive the traffic, the rankings, and the revenue to prove it.",
      whatsapp: "16787994634",
      phoneDisplay: "+1 (678) 799–4634",
      socialHandle: "zirka digital solutions",
      hours: "Monday – Friday, 9am – 6pm",
      stats: stats.map((s) => ({ value: s.num, label: s.label })),
      trustedBy: trustedNames.map((name) => ({ name })),
    },
  });
}

process.exit(0);
