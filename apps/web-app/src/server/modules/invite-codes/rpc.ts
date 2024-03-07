"use server";

import { redirect } from "@solidjs/router";
import { addWeeks } from "date-fns";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { object, safeParseAsync, string } from "valibot";

import { db } from "~/server/db";
import { inviteCodes } from "~/server/db/schemas/invite-codes";

import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { paths } from "~/lib/constants/paths";
import { to } from "~/lib/utils/common";
import {
  rpcErrorResponse,
  rpcSuccessResponse,
  rpcValidationErrorResponse,
} from "~/lib/utils/rpc";

export async function getInviteCodes$() {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw redirect(paths.signIn);
  }

  const [err, matchingInviteCodes] = await to(
    db
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.issuerId, sessionActor.data.id))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  return rpcSuccessResponse(matchingInviteCodes);
}

export async function createInviteCode$() {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw redirect(paths.signIn);
  }

  // TODO: check actor can create invites
  // TODO: check actor has available invites

  const now = new Date();

  const [err, newInviteCode] = await to(
    db
      .insert(inviteCodes)
      .values({
        issuerId: sessionActor.data.id,

        availableUses: 5, // TODO: Move to some sort of app config

        expiresAt: addWeeks(now, 1).toString(), // TODO: Move to some sort of app config

        createdAt: now.toString(),
      })
      .returning()
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  return rpcSuccessResponse(newInviteCode[0]);
}

export async function deleteInviteCode$(formData: FormData) {
  const sessionActor = await getSessionActor$();

  if (!sessionActor.success) {
    throw redirect(paths.signIn);
  }

  const parsed = await safeParseAsync(
    object({
      inviteCode: string(),
    }),
    decode(formData)
  );

  if (!parsed.success) {
    return rpcValidationErrorResponse(parsed.issues);
  }

  const [err, deletedInviteCode] = await to(
    db
      .delete(inviteCodes)
      .where(
        and(
          eq(inviteCodes.code, parsed.output.inviteCode),
          eq(inviteCodes.issuerId, sessionActor.data.id)
        )
      )
      .returning()
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  return rpcSuccessResponse(deletedInviteCode[0]);
}
