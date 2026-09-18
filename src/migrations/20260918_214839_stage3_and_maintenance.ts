import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_solution_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solution_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "solution_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solution_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solution_categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_solution_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solution_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_solution_categories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "site_settings_who_we_help_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "hero_headline" SET DEFAULT 'Turn clicks into customers.';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_emphasis" SET DEFAULT 'customers';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solution_categories_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "who_we_help_heading" varchar DEFAULT 'Built for businesses ready to grow.';
  ALTER TABLE "site_settings" ADD COLUMN "who_we_help_body" varchar DEFAULT 'We work with growing businesses that want marketing tied to real business outcomes — more visibility, better leads, stronger conversion, and scalable growth.';
  ALTER TABLE "features" ADD COLUMN "maintenance_mode" boolean DEFAULT false;
  ALTER TABLE "features" ADD COLUMN "maintenance_heading" varchar DEFAULT 'We''re making some improvements.';
  ALTER TABLE "features" ADD COLUMN "maintenance_message" varchar DEFAULT 'Our website is being updated and will be back shortly. For any enquiries, contact us — we''re still here and happy to help.';
  ALTER TABLE "features" ADD COLUMN "show_who_we_help" boolean DEFAULT true;
  ALTER TABLE "solution_categories_rels" ADD CONSTRAINT "solution_categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_categories_rels" ADD CONSTRAINT "solution_categories_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v" ADD CONSTRAINT "_solution_categories_v_parent_id_solution_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_rels" ADD CONSTRAINT "_solution_categories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solution_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_rels" ADD CONSTRAINT "_solution_categories_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_who_we_help_industries" ADD CONSTRAINT "site_settings_who_we_help_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "solution_categories_slug_idx" ON "solution_categories" USING btree ("slug");
  CREATE INDEX "solution_categories_updated_at_idx" ON "solution_categories" USING btree ("updated_at");
  CREATE INDEX "solution_categories_created_at_idx" ON "solution_categories" USING btree ("created_at");
  CREATE INDEX "solution_categories__status_idx" ON "solution_categories" USING btree ("_status");
  CREATE INDEX "solution_categories_rels_order_idx" ON "solution_categories_rels" USING btree ("order");
  CREATE INDEX "solution_categories_rels_parent_idx" ON "solution_categories_rels" USING btree ("parent_id");
  CREATE INDEX "solution_categories_rels_path_idx" ON "solution_categories_rels" USING btree ("path");
  CREATE INDEX "solution_categories_rels_services_id_idx" ON "solution_categories_rels" USING btree ("services_id");
  CREATE INDEX "_solution_categories_v_parent_idx" ON "_solution_categories_v" USING btree ("parent_id");
  CREATE INDEX "_solution_categories_v_version_version_slug_idx" ON "_solution_categories_v" USING btree ("version_slug");
  CREATE INDEX "_solution_categories_v_version_version_updated_at_idx" ON "_solution_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_solution_categories_v_version_version_created_at_idx" ON "_solution_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_solution_categories_v_version_version__status_idx" ON "_solution_categories_v" USING btree ("version__status");
  CREATE INDEX "_solution_categories_v_created_at_idx" ON "_solution_categories_v" USING btree ("created_at");
  CREATE INDEX "_solution_categories_v_updated_at_idx" ON "_solution_categories_v" USING btree ("updated_at");
  CREATE INDEX "_solution_categories_v_latest_idx" ON "_solution_categories_v" USING btree ("latest");
  CREATE INDEX "_solution_categories_v_rels_order_idx" ON "_solution_categories_v_rels" USING btree ("order");
  CREATE INDEX "_solution_categories_v_rels_parent_idx" ON "_solution_categories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solution_categories_v_rels_path_idx" ON "_solution_categories_v_rels" USING btree ("path");
  CREATE INDEX "_solution_categories_v_rels_services_id_idx" ON "_solution_categories_v_rels" USING btree ("services_id");
  CREATE INDEX "site_settings_who_we_help_industries_order_idx" ON "site_settings_who_we_help_industries" USING btree ("_order");
  CREATE INDEX "site_settings_who_we_help_industries_parent_id_idx" ON "site_settings_who_we_help_industries" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solution_categories_fk" FOREIGN KEY ("solution_categories_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_solution_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("solution_categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solution_categories_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solution_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solution_categories_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_who_we_help_industries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "solution_categories" CASCADE;
  DROP TABLE "solution_categories_rels" CASCADE;
  DROP TABLE "_solution_categories_v" CASCADE;
  DROP TABLE "_solution_categories_v_rels" CASCADE;
  DROP TABLE "site_settings_who_we_help_industries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solution_categories_fk";
  
  DROP INDEX "payload_locked_documents_rels_solution_categories_id_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "hero_headline" SET DEFAULT 'Where ideas become impact.';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_emphasis" SET DEFAULT 'impact';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solution_categories_id";
  ALTER TABLE "site_settings" DROP COLUMN "who_we_help_heading";
  ALTER TABLE "site_settings" DROP COLUMN "who_we_help_body";
  ALTER TABLE "features" DROP COLUMN "maintenance_mode";
  ALTER TABLE "features" DROP COLUMN "maintenance_heading";
  ALTER TABLE "features" DROP COLUMN "maintenance_message";
  ALTER TABLE "features" DROP COLUMN "show_who_we_help";
  DROP TYPE "public"."enum_solution_categories_status";
  DROP TYPE "public"."enum__solution_categories_v_version_status";`)
}
