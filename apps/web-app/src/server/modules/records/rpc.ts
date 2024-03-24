"use server";

import { SQL } from "drizzle-orm";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas/records";
import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { to } from "~/lib/utils/common";
import { rpcErrorResponse, rpcSuccessResponse } from "~/lib/utils/rpc";

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

export async function getRecordsPage$(
  filterQuery: SQL,
  cursor?: string,
  pageSize = 10
) {
  return await db.query.records.findMany({
    where: (_, op) =>
      cursor?.length
        ? op.and(op.lt(records.createdAt, cursor), filterQuery)
        : filterQuery,
    orderBy: (records, { desc }) => [desc(records.createdAt)],
    limit: pageSize,

    with: {
      author: true,
      versions: {
        orderBy: (recordVersions, { desc }) => [desc(recordVersions.createdAt)],
        limit: 1,
      },
    },
  });
}
