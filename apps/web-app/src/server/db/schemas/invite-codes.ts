import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { actors } from "~/server/db/schemas/actors";

import { nanoid } from "~/lib/utils/common";

export const inviteCodes = pgTable("invitation_codes", {
  code: varchar("code").primaryKey().$defaultFn(nanoid),

  issuerId: serial("issuer_id").notNull(),

  availableUses: integer("available_uses").notNull(),

  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const inviteCodesRelations = relations(inviteCodes, ({ one, many }) => ({
  issuer: one(actors, {
    fields: [inviteCodes.issuerId],
    references: [actors.id],
    relationName: "issued_invite",
  }),
  usedByActorIds: many(actors, {
    relationName: "accepted_invite",
  }),
}));
