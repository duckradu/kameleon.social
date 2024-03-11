"use server";

import { redirect } from "@solidjs/router";
import { addWeeks } from "date-fns";
import { decode } from "decode-formdata";
import { and, count, desc, eq } from "drizzle-orm";
import QRCode from "qrcode";
import { object, safeParseAsync, string } from "valibot";

import { db } from "~/server/db";
import { inviteCodes } from "~/server/db/schemas/invite-codes";

import { getSessionActor$ } from "~/server/modules/auth/rpc";

import { paths } from "~/lib/constants/paths";
import { getBaseUrl, to } from "~/lib/utils/common";
import {
  rpcErrorResponse,
  rpcSuccessResponse,
  rpcValidationErrorResponse,
} from "~/lib/utils/rpc";

import { MAX_INVITE_CODES_PER_ACTOR } from "~/server/modules/invite-codes/constants";

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
      .orderBy(desc(inviteCodes.createdAt))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  const inviteCodesWithQRCodeDataURL = matchingInviteCodes.map(
    async (inviteCode) => {
      const signUpWithInviteCodeURL = `${getBaseUrl()}${
        paths.signUp
      }?inviteCode=${inviteCode.code}`;

      return {
        ...inviteCode,

        signUpWithInviteCodeURL,
        qrCodeDataURL: await QRCode.toDataURL(signUpWithInviteCodeURL, {
          margin: 1,
        }),
      };
    }
  );

  const successResponse = await Promise.all(inviteCodesWithQRCodeDataURL);

  return rpcSuccessResponse(successResponse);
}

// TODO: Check actor can create invites
export async function createInviteCode$() {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw redirect(paths.signIn);
  }

  const [{ count: inviteCodesCount }] = await db
    .select({ count: count() })
    .from(inviteCodes)
    .where(eq(inviteCodes.issuerId, sessionActor.data.id));

  if (inviteCodesCount === MAX_INVITE_CODES_PER_ACTOR) {
    return rpcErrorResponse({
      message: "You've reached the limit of invite codes",
    });
  }

  const now = new Date();

  const [err, newInviteCode] = await to(
    db
      .insert(inviteCodes)
      .values({
        issuerId: sessionActor.data.id,

        availableUses: 5, // TODO: Move to some sort of app config

        expiresAt: addWeeks(now, 1).toISOString(), // TODO: Move to some sort of app config

        createdAt: now.toISOString(),
      })
      .returning()
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  return rpcSuccessResponse(newInviteCode[0]);
}

// TODO: Check if invite code has been used
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
