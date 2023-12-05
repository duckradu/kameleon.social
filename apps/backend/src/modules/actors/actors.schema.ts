import { Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import {
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { authRefreshTokens } from "~/modules/auth/auth.schema";

import { DEFAULT_SIZE, nanoid } from "~/utils/nanoid";

export const actors = pgTable("actors", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  publicId: varchar("public_id").notNull().unique().$defaultFn(nanoid),

  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),

  name: varchar("name", { length: 70 }),
  handle: varchar("handle", { length: 32 }).notNull().unique(),
  bio: varchar("bio", { length: 255 }),
  dob: timestamp("dob", { mode: "string" }),

  locale: varchar("locale", { length: 12 }).notNull().default("en"),

  coverUrl: text("cover_url"),
  avatarUrl: text("avatar_url"),
  externalUrl: text("external_url"),

  emailVerifiedAt: timestamp("email_verified_at", { mode: "string" }),
  lastSeenAt: timestamp("last_seen_at", { mode: "string" }),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const actorsRelations = relations(actors, ({ many }) => ({
  authRefreshTokens: many(authRefreshTokens),
}));

const selectActorSchema = createSelectSchema(actors, {
  publicId: Type.String({ minLength: DEFAULT_SIZE, maxLength: DEFAULT_SIZE }),
});

export const publicSelectActorSchema = Type.Pick(selectActorSchema, [
  "publicId",
  "email",
  "name",
  "handle",
  "bio",
  "dob",
  "locale",
  "coverUrl",
  "avatarUrl",
  "externalUrl",
  "emailVerifiedAt",
]);
