export const stats = [
  { num: "3.4×", label: "Average client ROAS" },
  { num: "128", label: "Brands guided since 2019" },
  { num: "$42M", label: "Ad spend managed yearly" },
  { num: "94%", label: "Client retention rate" },
];

export const trustedNames = [
  "Solace Skincare",
  "Northline Freight",
  "Verve Coffee Co.",
  "Atlas Fitness",
  "Harlow & Rye",
];

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  capabilities: string[];
  outcomes: string;
  plate: "plate-1" | "plate-2" | "plate-3" | "plate-4";
  icon: "target" | "compass" | "network" | "prism";
  image: string;
  alt: string;
};

export const services: Service[] = [
  {
    slug: "performance-marketing",
    name: "Performance Marketing",
    short:
      "Paid search, paid social, and programmatic media built on full-funnel attribution, not last-click guesswork.",
    description:
      "We plan media against a revenue target, not a channel budget. Every campaign is built with tracking in place before launch, so by week two we know exactly which audiences, creatives, and placements are earning their spend — and we cut the rest.",
    capabilities: ["Paid Search", "Paid Social", "Programmatic", "Marketplace Ads"],
    outcomes: "Typical engagement: 3.2–4.1× ROAS within the first two quarters.",
    plate: "plate-1",
    icon: "target",
    image: "/images/svc-performance.jpg",
    alt: "Performance analytics dashboard showing traffic and conversion charts",
  },
  {
    slug: "seo-organic-growth",
    name: "SEO & Organic Growth",
    short:
      "Technical audits, content architecture, and digital PR that compound instead of resetting every algorithm update.",
    description:
      "We treat SEO as infrastructure, not a stack of blog posts. Technical fixes come first, then a content map tied to real demand, then the digital PR and linking work that makes the map rank. It's slower to start and far cheaper to sustain than paid.",
    capabilities: ["Technical SEO", "Content Strategy", "Digital PR", "Local SEO"],
    outcomes: "Typical engagement: 80–140% organic traffic growth over 12 months.",
    plate: "plate-2",
    icon: "compass",
    image: "/images/svc-seo.jpg",
    alt: "Close-up of hands typing on a laptop while researching and writing",
  },
  {
    slug: "social-content",
    name: "Social & Content",
    short:
      "Editorial calendars, creative production, and community management that make a feed feel like a destination.",
    description:
      "A content calendar only works if someone is reading it as a viewer, not a checklist. We build a voice for the brand first, then a production system that can actually keep up with it — shoots, edits, captions, and the community management that keeps a feed alive between posts.",
    capabilities: ["Organic Social", "Creative Production", "Influencer", "Community"],
    outcomes: "Typical engagement: 2–3× engagement rate within 6 months.",
    plate: "plate-3",
    icon: "network",
    image: "/images/svc-social.jpg",
    alt: "Camera body and prime lenses laid out on a dark surface",
  },
  {
    slug: "brand-web-experience",
    name: "Brand & Web Experience",
    short:
      "Identity systems and conversion-minded web design, so every paid click lands somewhere worth the spend.",
    description:
      "Media spend is only as good as the page it lands on. We design identity systems and websites with the funnel already in mind — page speed, message match, and a conversion path that was tested before it shipped, not after.",
    capabilities: ["Brand Identity", "Web Design", "CRO", "Email / CRM"],
    outcomes: "Typical engagement: 20–35% lift in on-site conversion rate.",
    plate: "plate-4",
    icon: "prism",
    image: "/images/svc-brand.jpg",
    alt: "Designer working with a drawing tablet, colour swatches and brand sketches",
  },
];

export type WorkItem = {
  name: string;
  category: string;
  metric: string;
  summary: string;
  plate: "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
  image: string;
  alt: string;
};

export const work: WorkItem[] = [
  {
    name: "Solace Skincare",
    category: "Skincare · Performance",
    metric: "3.2× ROAS in 90 days",
    summary: "Rebuilt paid social from cold-audience guesswork into a tiered retargeting funnel.",
    plate: "w1",
    image: "/images/work-skincare.jpg",
    alt: "Minimal skincare serum bottle with a gold cap on a marble surface",
  },
  {
    name: "Northline Freight",
    category: "Freight · SEO",
    metric: "+118% organic traffic",
    summary: "Technical SEO overhaul plus a content map built around real carrier search demand.",
    plate: "w2",
    image: "/images/work-freight.jpg",
    alt: "Freight truck on a highway at dusk",
  },
  {
    name: "Verve Coffee Co.",
    category: "Coffee · Brand + Web",
    metric: "4.6× revenue in 1 year",
    summary: "New identity system and a subscription-first web experience replacing a five-year-old site.",
    plate: "w3",
    image: "/images/work-coffee.jpg",
    alt: "Bright specialty coffee shop interior with arched windows and a hand-set menu board",
  },
  {
    name: "Atlas Fitness",
    category: "Fitness App · Paid Social",
    metric: "−62% cost per install",
    summary: "Creative testing pipeline that cut acquisition cost while tripling weekly ad volume.",
    plate: "w4",
    image: "/images/work-fitness.jpg",
    alt: "Moody gym interior with weight racks under warm lighting",
  },
  {
    name: "Harlow & Rye",
    category: "Home Goods · Email / CRM",
    metric: "+41% repeat purchase rate",
    summary: "Lifecycle email program rebuilt around real purchase cadence instead of a weekly blast.",
    plate: "w5",
    image: "/images/work-homegoods.jpg",
    alt: "Row of handmade ceramic vases in neutral glazes",
  },
  {
    name: "Meridian Legal",
    category: "Professional Services · SEO",
    metric: "3.1× qualified leads",
    summary: "Local SEO and digital PR program that took a five-office firm to page one in every market.",
    plate: "w6",
    image: "/images/work-legal.jpg",
    alt: "Modern glass-walled meeting room with a long table in raking daylight",
  },
];

export const steps = [
  {
    idx: "01",
    name: "Chart",
    description: "Audit the market, the funnel, and the data — find out where the growth is actually stuck.",
  },
  {
    idx: "02",
    name: "Align",
    description: "Set the channel mix and budget plan against one shared revenue target, not vanity metrics.",
  },
  {
    idx: "03",
    name: "Launch",
    description: "Ship campaigns, content, and pages in weeks, not quarters — built to be measured from day one.",
  },
  {
    idx: "04",
    name: "Navigate",
    description: "Weekly optimization against the data, so spend keeps moving toward what's actually working.",
  },
];

export type Engagement = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const engagements: Engagement[] = [
  {
    name: "Project",
    price: "From $3,500",
    cadence: "one-off scope",
    summary:
      "A defined piece of work with a start and an end — useful when you know what you need built.",
    includes: [
      "Website design & build",
      "Brand identity system",
      "Technical SEO audit",
      "Campaign launch setup",
    ],
  },
  {
    name: "Growth Retainer",
    price: "$5,000 – $12,000",
    cadence: "per month",
    summary:
      "Two to three channels run properly month over month, with the strategy work that keeps them honest.",
    includes: [
      "2–3 channels managed",
      "Monthly strategy session",
      "Live performance dashboard",
      "Creative production included",
      "Senior strategist on the account",
    ],
    featured: true,
  },
  {
    name: "Full Partnership",
    price: "$15,000+",
    cadence: "per month",
    summary:
      "All four disciplines running together, with a dedicated team treating your growth as the only brief.",
    includes: [
      "Full-funnel across all services",
      "Dedicated pod, not shared hours",
      "Weekly optimization cycles",
      "Quarterly board-ready reporting",
      "Priority creative turnaround",
    ],
  },
];

export const faqs = [
  {
    q: "How quickly will we see results?",
    a: "It depends on the channel, and we'll tell you which at kickoff rather than after. Paid media usually shows a readable signal in two to three weeks. SEO and content compound over three to six months. Anyone promising you rankings in thirty days is selling you something.",
  },
  {
    q: "What's the minimum commitment?",
    a: "Retainers start on a three-month initial term, then run month to month. The initial term exists because most channels need that long to produce data worth acting on — not to lock you in. Projects are scoped as one-off work with no ongoing commitment.",
  },
  {
    q: "Do you work alongside our in-house team?",
    a: "Often, yes. Sometimes we run the channels a small team can't staff; sometimes we build the system and train your team to take it over. We'd rather hand something off well than manufacture a dependency.",
  },
  {
    q: "Who actually works on my account?",
    a: "The strategist you meet in the first conversation runs your account in month twelve. There's no pitch team that disappears after signing and no handoff to a junior pod — that's the main reason we stay deliberately small.",
  },
  {
    q: "How do you report on performance?",
    a: "You get access to the same live dashboard we work from, so you can check any number at any time without asking. On top of that there's a monthly review call where we talk through what moved, what didn't, and what changes next month.",
  },
  {
    q: "What happens if it isn't working?",
    a: "We tell you before you have to ask. If a channel isn't earning its spend, we say so, explain why, and either fix it or move the budget somewhere that will. After the initial term you're month to month, so staying is always your choice.",
  },
];

export const testimonial = {
  quote:
    "We'd been through two agencies that sent beautiful reports and no revenue. Zirka rebuilt our funnel in six weeks and showed us the number that actually mattered. We've tripled spend since, because every dollar is accounted for.",
  name: "Priya Raman",
  role: "Chief Marketing Officer",
  company: "Solace Skincare",
};

export const values = [
  {
    name: "Revenue is the brief",
    description:
      "Reach and impressions are inputs, not the deliverable. Every plan is written back against pipeline or sales.",
  },
  {
    name: "Show the working",
    description:
      "Clients see the same dashboards we do. No metric ships in a report that they can't also pull themselves.",
  },
  {
    name: "Small team, senior hands",
    description:
      "No handoff to a junior pod after the pitch. The strategist you meet in week one runs the account in month twelve.",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export const team: TeamMember[] = [
  { name: "Dara Osei", role: "Founder & Strategy Director", image: "/images/team-dara.jpg" },
  { name: "Marcus Wren", role: "Head of Performance Media", image: "/images/team-marcus.jpg" },
  { name: "Imogen Castellan", role: "Head of SEO & Content", image: "/images/team-imogen.jpg" },
  { name: "Teo Alvarez", role: "Creative & Brand Director", image: "/images/team-teo.jpg" },
];
