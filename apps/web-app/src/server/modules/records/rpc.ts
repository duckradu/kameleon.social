"use server";

import { JSONContent } from "@tiptap/core";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas/records";
import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { rpcErrorResponse } from "~/lib/utils/rpc";

export async function createRecord$(
  content: JSONContent,
  parentRecordId?: (typeof records.$inferInsert)["parentRecordId"]
) {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw rpcErrorResponse({
      message: "You need to be authenticated to create a record.",
    });
  }

  const [newRecord, newRecordVersion] = await db.transaction(async (tx) => {
    const [newRecord] = await tx
      .insert(records)
      .values({
        authorId: sessionActor.data.id,
        parentRecordId,
      })
      .returning();

    const [newRecordVersion] = await tx
      .insert(recordVersions)
      .values({
        authorId: sessionActor.data.id,
        recordId: newRecord.id,

        content,
      })
      .returning();

    return [newRecord, newRecordVersion];
  });

  // TODO: RPCRESPOSE IT :D
  return {
    ...newRecord,
    latestVersion: newRecordVersion,
  };
}
