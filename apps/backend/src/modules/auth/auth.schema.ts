import { Type } from "@sinclair/typebox";
import { relations } from "drizzle-orm";
import {
  bigserial,
  index,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { actors } from "~/modules/actors/actors.schema";

export const authRefreshTokens = pgTable(
  "auth_refresh_tokens",
  {
    id: varchar("id").primaryKey(),

    actorId: bigserial("actor_id", { mode: "number" }).notNull(),

    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  },
  (table) => ({
    actorIdIdx: index("actor_id_idx").on(table.actorId),
  })
);

export const authRefreshTokensRelations = relations(
  authRefreshTokens,
  ({ one }) => ({
    actor: one(actors, {
      fields: [authRefreshTokens.actorId],
      references: [actors.id],
    }),
  })
);

export const signInWithCredentialsSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});
