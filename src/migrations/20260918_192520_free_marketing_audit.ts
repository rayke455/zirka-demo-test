import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_submissions_kind" AS ENUM('enquiry', 'audit');
  ALTER TABLE "submissions" ALTER COLUMN "message" DROP NOT NULL;
  ALTER TABLE "submissions" ADD COLUMN "kind" "enum_submissions_kind" DEFAULT 'enquiry';
  ALTER TABLE "submissions" ADD COLUMN "phone" varchar;
  ALTER TABLE "submissions" ADD COLUMN "website" varchar;
  ALTER TABLE "submissions" ADD COLUMN "goal" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_utm_source" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_utm_medium" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_utm_campaign" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_utm_content" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_utm_term" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_landing_page" varchar;
  ALTER TABLE "submissions" ADD COLUMN "attribution_referrer" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions" ALTER COLUMN "message" SET NOT NULL;
  ALTER TABLE "submissions" DROP COLUMN "kind";
  ALTER TABLE "submissions" DROP COLUMN "phone";
  ALTER TABLE "submissions" DROP COLUMN "website";
  ALTER TABLE "submissions" DROP COLUMN "goal";
  ALTER TABLE "submissions" DROP COLUMN "attribution_utm_source";
  ALTER TABLE "submissions" DROP COLUMN "attribution_utm_medium";
  ALTER TABLE "submissions" DROP COLUMN "attribution_utm_campaign";
  ALTER TABLE "submissions" DROP COLUMN "attribution_utm_content";
  ALTER TABLE "submissions" DROP COLUMN "attribution_utm_term";
  ALTER TABLE "submissions" DROP COLUMN "attribution_landing_page";
  ALTER TABLE "submissions" DROP COLUMN "attribution_referrer";
  DROP TYPE "public"."enum_submissions_kind";`)
}
