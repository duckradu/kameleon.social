CREATE TABLE IF NOT EXISTS "actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"pid" varchar NOT NULL,
	"used_invite_code" varchar,
	"email" varchar NOT NULL,
	"encrypted_password" varchar NOT NULL,
	"name" varchar(255),
	"note" text,
	"external_url" text,
	"locale" varchar(12) DEFAULT 'en' NOT NULL,
	"onboarding_in_progress" boolean DEFAULT true NOT NULL,
	"email_confirmation_sent_at" timestamp,
	"email_confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "actors_pid_unique" UNIQUE("pid"),
	CONSTRAINT "actors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invite_codes" (
	"code" varchar PRIMARY KEY NOT NULL,
	"issuer_id" serial NOT NULL,
	"available_uses" integer DEFAULT 5 NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "index_actors_on_pid" ON "actors" ("pid");