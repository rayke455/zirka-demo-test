import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_features_site_theme" AS ENUM('emerald', 'midnight', 'onyx', 'plum');
  ALTER TABLE "features" ADD COLUMN "site_theme" "enum_features_site_theme" DEFAULT 'emerald';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "features" DROP COLUMN "site_theme";
  DROP TYPE "public"."enum_features_site_theme";`)
}
