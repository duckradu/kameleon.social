"use server";

import { object, safeParseAsync, unknown } from "valibot";
import { decode } from "decode-formdata";

import { getSessionActor$ } from "../auth/rpc";

import { rpcErrorResponse, rpcValidationErrorResponse } from "~/lib/utils/rpc";
import { db } from "~/server/db";
import { records } from "~/server/db/schemas/records";

export async function createRecord(formData: FormData) {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw rpcErrorResponse({
      message: "You need to be authenticated to create a record.",
    });
  }

  const parsed = await safeParseAsync(
    object({
      // parentRecordId:
      recordContent: object({}, unknown()),
    }),
    decode(formData)
  );

  console.log(parsed);

  if (!parsed.success) {
    return rpcValidationErrorResponse(parsed.issues);
  }

  const f = await db.insert(records).values({
    authorId: 2,
    latestVersionId: 2,
  });
}
