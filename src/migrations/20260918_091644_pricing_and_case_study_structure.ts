import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_project_pricing_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__project_pricing_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "project_pricing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"note" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_project_pricing_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_project_pricing_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_price" varchar,
  	"version_note" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__project_pricing_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "case_studies" ADD COLUMN "timeframe" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "testimonial_quote" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "testimonial_attribution" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "sample" boolean DEFAULT false;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_timeframe" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_testimonial_quote" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_testimonial_attribution" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_sample" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_pricing_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "project_pricing_note" varchar DEFAULT 'Final pricing depends on project scope and requirements.';
  ALTER TABLE "_project_pricing_v" ADD CONSTRAINT "_project_pricing_v_parent_id_project_pricing_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project_pricing"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "project_pricing_updated_at_idx" ON "project_pricing" USING btree ("updated_at");
  CREATE INDEX "project_pricing_created_at_idx" ON "project_pricing" USING btree ("created_at");
  CREATE INDEX "project_pricing__status_idx" ON "project_pricing" USING btree ("_status");
  CREATE INDEX "_project_pricing_v_parent_idx" ON "_project_pricing_v" USING btree ("parent_id");
  CREATE INDEX "_project_pricing_v_version_version_updated_at_idx" ON "_project_pricing_v" USING btree ("version_updated_at");
  CREATE INDEX "_project_pricing_v_version_version_created_at_idx" ON "_project_pricing_v" USING btree ("version_created_at");
  CREATE INDEX "_project_pricing_v_version_version__status_idx" ON "_project_pricing_v" USING btree ("version__status");
  CREATE INDEX "_project_pricing_v_created_at_idx" ON "_project_pricing_v" USING btree ("created_at");
  CREATE INDEX "_project_pricing_v_updated_at_idx" ON "_project_pricing_v" USING btree ("updated_at");
  CREATE INDEX "_project_pricing_v_latest_idx" ON "_project_pricing_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_pricing_fk" FOREIGN KEY ("project_pricing_id") REFERENCES "public"."project_pricing"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_project_pricing_id_idx" ON "payload_locked_documents_rels" USING btree ("project_pricing_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "project_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_project_pricing_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "project_pricing" CASCADE;
  DROP TABLE "_project_pricing_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_project_pricing_fk";
  
  DROP INDEX "payload_locked_documents_rels_project_pricing_id_idx";
  ALTER TABLE "case_studies" DROP COLUMN "timeframe";
  ALTER TABLE "case_studies" DROP COLUMN "testimonial_quote";
  ALTER TABLE "case_studies" DROP COLUMN "testimonial_attribution";
  ALTER TABLE "case_studies" DROP COLUMN "sample";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_timeframe";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_testimonial_quote";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_testimonial_attribution";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_sample";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_pricing_id";
  ALTER TABLE "site_settings" DROP COLUMN "project_pricing_note";
  DROP TYPE "public"."enum_project_pricing_status";
  DROP TYPE "public"."enum__project_pricing_v_version_status";`)
}
