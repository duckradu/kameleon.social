import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { nanoid } from "~/lib/utils/common";

// WIP
export const records = pgTable(
  "records",
  {
    id: serial("id").primaryKey(),
    pid: varchar("pid").notNull().$defaultFn(nanoid), // TODO: Get a nicer gen

    authorId: serial("author_id").notNull(),

    // versions:
    // latestVersionId:

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // indexOnAuthorAndPID
  })
);

export const recordVersions = pgTable("record_versions", {
  id: serial("id").primaryKey(),

  authorId: serial("author_id").notNull(),

  // postId

  // title?: string
  // desc?: string

  // content: RecordContent

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

// WB blocks?

export const recordBlockJSON = pgTable("record_block_json", {});

export const recordBlockImages = pgTable("record_block_images", {});

export const recordBlockGalleries = pgTable("record_block_galleries", {});

export const recordBlockVideos = pgTable("record_block_videos", {});

export const recordBlockAudios = pgTable("record_block_audios", {});
