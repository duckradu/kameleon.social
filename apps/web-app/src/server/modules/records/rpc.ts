"use server";

import { decode } from "decode-formdata";
import { object, safeParseAsync, string } from "valibot";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas/records";
import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { to } from "~/lib/utils/common";
import { rpcErrorResponse, rpcValidationErrorResponse } from "~/lib/utils/rpc";

export async function createRecord$(formData: FormData) {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw rpcErrorResponse({
      message: "You need to be authenticated to create a record.",
    });
  }

  const parsed = await safeParseAsync(
    object({
      // parentRecordId:
      recordContent: string(),
    }),
    decode(formData)
  );

  if (!parsed.success) {
    return rpcValidationErrorResponse(parsed.issues);
  }

  // TODO: Don't do this. Add valibot custom validator
  const [err, recordContentJSON] = await to(
    new Promise((resolve, reject) => {
      try {
        resolve(JSON.parse(parsed.output.recordContent));
      } catch (e) {
        reject(e);
      }
    })
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  const result = await db.transaction(async (tx) => {
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

        content: recordContentJSON,
      })
      .returning();

    return [newRecord, newRecordVersion];
  });

  console.log(result);
}
