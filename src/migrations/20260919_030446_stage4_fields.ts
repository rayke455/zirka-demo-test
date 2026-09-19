import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_services_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "team_members_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "_team_members_v_version_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "features" ALTER COLUMN "maintenance_message" SET DEFAULT 'Our website is being updated and will be back shortly. We''re still working in the meantime, and happy to help.';
  ALTER TABLE "services" ADD COLUMN "problem" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_problem" varchar;
  ALTER TABLE "team_members" ADD COLUMN "bio" varchar;
  ALTER TABLE "team_members" ADD COLUMN "experience" varchar;
  ALTER TABLE "team_members" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "_team_members_v" ADD COLUMN "version_bio" varchar;
  ALTER TABLE "_team_members_v" ADD COLUMN "version_experience" varchar;
  ALTER TABLE "_team_members_v" ADD COLUMN "version_linkedin" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "photo_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "logo_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "result" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "case_study_id" integer;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_photo_id" integer;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_logo_id" integer;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_result" varchar;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_case_study_id" integer;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faqs" ADD CONSTRAINT "_services_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_certifications" ADD CONSTRAINT "team_members_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v_version_certifications" ADD CONSTRAINT "_team_members_v_version_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_members_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_faqs_order_idx" ON "_services_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_version_faqs_parent_id_idx" ON "_services_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "team_members_certifications_order_idx" ON "team_members_certifications" USING btree ("_order");
  CREATE INDEX "team_members_certifications_parent_id_idx" ON "team_members_certifications" USING btree ("_parent_id");
  CREATE INDEX "_team_members_v_version_certifications_order_idx" ON "_team_members_v_version_certifications" USING btree ("_order");
  CREATE INDEX "_team_members_v_version_certifications_parent_id_idx" ON "_team_members_v_version_certifications" USING btree ("_parent_id");
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_case_study_id_case_studies_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_case_study_id_case_studies_id_fk" FOREIGN KEY ("version_case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_logo_idx" ON "testimonials" USING btree ("logo_id");
  CREATE INDEX "testimonials_case_study_idx" ON "testimonials" USING btree ("case_study_id");
  CREATE INDEX "_testimonials_v_version_version_photo_idx" ON "_testimonials_v" USING btree ("version_photo_id");
  CREATE INDEX "_testimonials_v_version_version_logo_idx" ON "_testimonials_v" USING btree ("version_logo_id");
  CREATE INDEX "_testimonials_v_version_version_case_study_idx" ON "_testimonials_v" USING btree ("version_case_study_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members_certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_members_v_version_certifications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "_services_v_version_faqs" CASCADE;
  DROP TABLE "team_members_certifications" CASCADE;
  DROP TABLE "_team_members_v_version_certifications" CASCADE;
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_photo_id_media_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_logo_id_media_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_case_study_id_case_studies_id_fk";
  
  ALTER TABLE "_testimonials_v" DROP CONSTRAINT "_testimonials_v_version_photo_id_media_id_fk";
  
  ALTER TABLE "_testimonials_v" DROP CONSTRAINT "_testimonials_v_version_logo_id_media_id_fk";
  
  ALTER TABLE "_testimonials_v" DROP CONSTRAINT "_testimonials_v_version_case_study_id_case_studies_id_fk";
  
  DROP INDEX "testimonials_photo_idx";
  DROP INDEX "testimonials_logo_idx";
  DROP INDEX "testimonials_case_study_idx";
  DROP INDEX "_testimonials_v_version_version_photo_idx";
  DROP INDEX "_testimonials_v_version_version_logo_idx";
  DROP INDEX "_testimonials_v_version_version_case_study_idx";
  ALTER TABLE "features" ALTER COLUMN "maintenance_message" SET DEFAULT 'Our website is being updated and will be back shortly. For any enquiries, contact us — we''re still here and happy to help.';
  ALTER TABLE "services" DROP COLUMN "problem";
  ALTER TABLE "_services_v" DROP COLUMN "version_problem";
  ALTER TABLE "team_members" DROP COLUMN "bio";
  ALTER TABLE "team_members" DROP COLUMN "experience";
  ALTER TABLE "team_members" DROP COLUMN "linkedin";
  ALTER TABLE "_team_members_v" DROP COLUMN "version_bio";
  ALTER TABLE "_team_members_v" DROP COLUMN "version_experience";
  ALTER TABLE "_team_members_v" DROP COLUMN "version_linkedin";
  ALTER TABLE "testimonials" DROP COLUMN "photo_id";
  ALTER TABLE "testimonials" DROP COLUMN "logo_id";
  ALTER TABLE "testimonials" DROP COLUMN "result";
  ALTER TABLE "testimonials" DROP COLUMN "case_study_id";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_photo_id";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_logo_id";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_result";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_case_study_id";`)
}
