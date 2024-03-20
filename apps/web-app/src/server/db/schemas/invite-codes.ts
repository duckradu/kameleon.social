import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { actors } from "~/server/db/schemas/actors";

import { nanoid } from "~/lib/utils/common";

export const inviteCodes = pgTable("invite_codes", {
  code: varchar("code").primaryKey().$defaultFn(nanoid),

  issuerId: integer("issuer_id").notNull(),

  availableUses: integer("available_uses").notNull().default(5),

  isEnabled: boolean("is_enabled").notNull().default(true),

  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const inviteCodesRelations = relations(inviteCodes, ({ one, many }) => ({
  issuer: one(actors, {
    fields: [inviteCodes.issuerId],
    references: [actors.id],
    relationName: "issued_invite_code",
  }),
  usedByActorIds: many(actors, {
    relationName: "used_invite_code",
  }),
}));
