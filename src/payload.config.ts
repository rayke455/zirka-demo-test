import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Services } from "./payload/collections/Services";
import { CaseStudies } from "./payload/collections/CaseStudies";
import { TeamMembers } from "./payload/collections/TeamMembers";
import { Testimonials } from "./payload/collections/Testimonials";
import { Engagements } from "./payload/collections/Engagements";
import { Faqs } from "./payload/collections/Faqs";
import { Submissions } from "./payload/collections/Submissions";
import { PageViews } from "./payload/collections/PageViews";
import { ProcessSteps } from "./payload/collections/ProcessSteps";
import { Values } from "./payload/collections/Values";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { Features } from "./payload/globals/Features";
import { BookingSettings } from "./payload/globals/BookingSettings";
import { Bookings } from "./payload/collections/Bookings";
import { Quotes } from "./payload/collections/Quotes";
import { emailAdapter } from "./payload/email";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: {
        Logo: "/payload/components/Logo",
        Icon: "/payload/components/Icon",
      },
      beforeDashboard: ["/payload/components/BeforeDashboard"],
    },
    meta: {
      titleSuffix: " — Zirka Admin",
      description: "Content and enquiries for Zirka Digital Solutions.",
    },
  },
  collections: [
    Services,
    CaseStudies,
    TeamMembers,
    Testimonials,
    ProcessSteps,
    Values,
    Faqs,
    Engagements,
    Submissions,
    Bookings,
    Quotes,
    PageViews,
    Media,
    Users,
  ],
  globals: [SiteSettings, Features, BookingSettings],
  email: emailAdapter,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    // Automatic schema push generates duplicate CREATE INDEX statements for this
    // schema and fails. Schema changes go through migrations instead:
    //   npm run migrate:create   then   npm run migrate
    push: false,
    client: {
      url: process.env.DATABASE_URI || "file:./zirka.db",
    },
  }),
  sharp,
});
