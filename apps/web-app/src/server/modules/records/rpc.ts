"use server";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas/records";
import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { rpcErrorResponse, rpcSuccessResponse } from "~/lib/utils/rpc";
import { to } from "~/lib/utils/common";

export async function createRecord$({
  record,
  recordVersion,
}: {
  record?: Pick<typeof records.$inferInsert, "pid" | "parentRecordId">;
  recordVersion: Pick<typeof recordVersions.$inferInsert, "content">;
}) {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    return rpcErrorResponse({
      message: "You need to be authenticated to create a record.",
    });
  }

  if (!recordVersion.content) {
    return rpcErrorResponse({
      message: "Records cannot be created without content.",
    });
  }

  const [err, [newRecord, newRecordVersion] = []] = await to(
    db.transaction(async (tx) => {
      const [newRecord] = await tx
        .insert(records)
        .values({
          pid: record?.pid,
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
    })
  );

  if (err) {
    return rpcErrorResponse({
      // TODO: Format the error message and return it
      message: "Internal server error",
    });
  }

  return rpcSuccessResponse({
    ...newRecord,
    latestVersion: newRecordVersion,
  });
}
