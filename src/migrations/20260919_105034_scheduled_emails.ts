import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "features" ADD COLUMN "follow_up_reminders" boolean DEFAULT true;
  ALTER TABLE "features" ADD COLUMN "untouched_lead_nudges" boolean DEFAULT true;
  ALTER TABLE "features" ADD COLUMN "weekly_summary" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "features" DROP COLUMN "follow_up_reminders";
  ALTER TABLE "features" DROP COLUMN "untouched_lead_nudges";
  ALTER TABLE "features" DROP COLUMN "weekly_summary";`)
}
