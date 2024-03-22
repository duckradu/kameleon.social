CREATE TABLE IF NOT EXISTS "record_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"record_id" integer NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"pid" varchar NOT NULL,
	"author_id" integer NOT NULL,
	"parent_record_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "unique_records_on_author_id_and_pid" UNIQUE("author_id","pid")
);
--> statement-breakpoint
ALTER TABLE "invite_codes" ALTER COLUMN "issuer_id" SET DATA TYPE integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "index_record_versions_on_author_id" ON "record_versions" ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "index_record_versions_on_record_id" ON "record_versions" ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "index_records_on_author_id" ON "records" ("author_id");