import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { inviteCodes } from "~/server/db/schemas/invite-codes";

import { nanoid } from "~/lib/utils/common";

export const actors = pgTable(
  "actors",
  {
    id: serial("id").primaryKey(),
    pid: varchar("pid").notNull().unique().$defaultFn(nanoid), // TODO: Generate nicer handles

    acceptedInviteCode: varchar("accepted_invite_code"),

    email: varchar("email").notNull().unique(),
    encryptedPassword: varchar("encrypted_password").notNull(),

    name: varchar("name", { length: 255 }),
    note: text("note"),
    externalUrl: text("external_url"),

    // TODO: Add DOB

    locale: varchar("locale", { length: 12 }).notNull().default("en"),

    onboardingInProgress: boolean("onboarding_in_progress")
      .notNull()
      .default(true),

    emailConfirmationSentAt: timestamp("email_confirmation_sent_at", {
      mode: "string",
    }),
    emailConfirmedAt: timestamp("email_confirmed_at", { mode: "string" }),
    // passwordExpiresAt: timestamp("password_expires_at", { mode: "string" }),

    // * Represents `used_at` for `accepted_invite_code`
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    indexActorsOnPid: index("index_actors_on_pid").on(table.pid),
  })
);

export const actorsRelations = relations(actors, ({ one, many }) => ({
  acceptedInvite: one(inviteCodes, {
    fields: [actors.acceptedInviteCode],
    references: [inviteCodes.code],
  }),
  inviteCodes: many(inviteCodes),
}));
