"use server";

import { JSONContent } from "@tiptap/core";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas/records";
import { getSessionActor$ } from "~/server/modules/auth/rpc";
import { findOneByPID$ } from "~/server/modules/actors/rpc";

import { rpcErrorResponse, rpcSuccessResponse } from "~/lib/utils/rpc";

export async function getRecordListByAuthorPid$(actorPid: string) {
  const matchingActor = await findOneByPID$(actorPid);

  const result = await db.query.records.findMany({
    where: (records, { eq }) => eq(records.authorId, matchingActor.id),
    with: {
      versions: {
        orderBy: (recordVersions, { desc }) => [desc(recordVersions.createdAt)],
        limit: 1,
      },
    },
    orderBy: (records, { desc }) => [desc(records.createdAt)],
  });

  if (!result.length) {
    return rpcSuccessResponse([]);
  }

  return rpcSuccessResponse(
    result.reduce(
      (acc, { versions, ...curr }) => [
        ...acc,
        { ...curr, latestVersion: versions[0] },
      ],
      [] as (typeof records.$inferSelect & {
        latestVersion: typeof recordVersions.$inferSelect;
      })[]
    )
  );
}

export async function createRecord$(content: JSONContent) {
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

  return {
    ...newRecord,
    latestVersion: newRecordVersion,
  };
}
