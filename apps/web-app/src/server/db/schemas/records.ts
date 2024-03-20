import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { nanoid } from "~/lib/utils/common";

export const records = pgTable(
  "records",
  {
    id: serial("id").primaryKey(),
    pid: varchar("pid").notNull().$defaultFn(nanoid), // TODO: Get a nicer gen

    authorId: integer("author_id").notNull(),

    latestVersionId: integer("latest_version_id").notNull(),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => ({
    pkOnAuthorAndPid: primaryKey({ columns: [table.authorId, table.pid] }),
  })
);

export const recordsRelations = relations(records, ({ one, many }) => ({
  versions: many(recordVersions),
  latestVersion: one(recordVersions, {
    fields: [records.latestVersionId],
    references: [recordVersions.id],
  }),
}));

export const recordVersions = pgTable("record_versions", {
  id: serial("id").primaryKey(),

  authorId: integer("author_id").notNull(),
  recordId: integer("recordId").notNull(),

  content: jsonb("content"),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const recordVersionsRelations = relations(recordVersions, ({ one }) => ({
  record: one(records, {
    fields: [recordVersions.recordId],
    references: [records.id],
  }),
}));

// export const recordBlockJSON = pgTable("record_block_json", {});

// export const recordBlockImages = pgTable("record_block_images", {});

// export const recordBlockGalleries = pgTable("record_block_galleries", {});

// export const recordBlockVideos = pgTable("record_block_videos", {});

// export const recordBlockAudios = pgTable("record_block_audios", {});
