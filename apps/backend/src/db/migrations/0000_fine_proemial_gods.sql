CREATE TABLE IF NOT EXISTS "actors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"public_id" varchar NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	"name" varchar(70),
	"handle" varchar(32) NOT NULL,
	"bio" varchar(255),
	"dob" timestamp,
	"locale" varchar(12) DEFAULT 'en' NOT NULL,
	"cover_url" text,
	"avatar_url" text,
	"external_url" text,
	"email_verified_at" timestamp,
	"last_seen_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "actors_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "actors_email_unique" UNIQUE("email"),
	CONSTRAINT "actors_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" varchar PRIMARY KEY NOT NULL,
	"actor_id" bigserial NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "actor_public_id_idx" ON "actors" ("public_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "actor_id_idx" ON "refresh_tokens" ("actor_id");