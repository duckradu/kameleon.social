"use server";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas/records";
import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { rpcErrorResponse } from "~/lib/utils/rpc";

export async function createRecord$({
  record,
  recordVersion,
}: {
  record?: Pick<typeof records.$inferInsert, "pid" | "parentRecordId">;
  recordVersion: Pick<typeof recordVersions.$inferInsert, "content">;
}) {
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
        parentRecordId: record?.parentRecordId,
      })
      .returning();

    const [newRecordVersion] = await tx
      .insert(recordVersions)
      .values({
        authorId: sessionActor.data.id,
        recordId: newRecord.id,

        content: recordVersion.content,
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
