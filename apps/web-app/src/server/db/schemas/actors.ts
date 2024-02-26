import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { nanoid } from "~/lib/utils/common";

export const actors = pgTable(
  "actors",
  {
    id: serial("id").primaryKey(),
    pid: varchar("pid").notNull().unique().$defaultFn(nanoid), // Generate handles

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

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    indexActorsOnPid: index("index_actors_on_pid").on(table.pid),
  })
);
