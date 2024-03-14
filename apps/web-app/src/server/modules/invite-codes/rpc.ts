"use server";

import { redirect } from "@solidjs/router";
import { addWeeks } from "date-fns";
import { decode } from "decode-formdata";
import { and, count, desc, eq, sql } from "drizzle-orm";
import QRCode from "qrcode";
import { object, safeParseAsync, string } from "valibot";

import { db } from "~/server/db";
import { inviteCodes } from "~/server/db/schemas/invite-codes";
import { actors } from "~/server/db/schemas/actors";
import { getSessionActor$ } from "~/server/modules/auth/rpc";
import { MAX_INVITE_CODES_PER_ACTOR } from "~/server/modules/invite-codes/constants";

import { getBaseUrl, to } from "~/lib/utils/common";
import {
  rpcErrorResponse,
  rpcSuccessResponse,
  rpcValidationErrorResponse,
} from "~/lib/utils/rpc";
import { paths } from "~/lib/constants/paths";

export async function getInviteCodes$() {
  const sessionActor = await getSessionActor$();

  if (!sessionActor?.success) {
    throw redirect(paths.signIn);
  }

  const [err, matchingInviteCodes] = await to(
    db
      .select()
      .from(inviteCodes)
      .leftJoin(actors, eq(inviteCodes.code, actors.usedInviteCode))
      .where(eq(inviteCodes.issuerId, sessionActor.data.id))
      .orderBy(desc(inviteCodes.createdAt))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  const aggregatedOnInviteCode = matchingInviteCodes!.reduce<
    Record<
      string,
      {
        invite_code: typeof inviteCodes.$inferSelect;
        actors: (typeof actors.$inferSelect)[];
      }
    >
  >((acc, row) => {
    const invite_code = row.invite_codes;
    const actor = row.actors;

    if (!acc[invite_code.code]) {
      acc[invite_code.code] = { invite_code, actors: [] };
    }

    if (actor) {
      acc[invite_code.code].actors.push(actor);
    }

    return acc;
  }, {});

  const inviteCodesWithQRCodeDataURL = Object.values(
    aggregatedOnInviteCode
  ).map(async ({ invite_code, actors }) => {
    const signUpWithInviteCodeURL = `${getBaseUrl()}${
      paths.signUp
    }?inviteCode=${invite_code.code}`;

    return {
      ...invite_code,

      signUpWithInviteCodeURL,
      qrCodeDataURL: await QRCode.toDataURL(signUpWithInviteCodeURL, {
        margin: 1,
      }),

      usedBy: actors,
    };
  });

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

  let err,
    matchingInviteCodes:
      | {
          invite_codes: typeof inviteCodes.$inferSelect;
          actors: typeof actors.$inferSelect | null;
        }[]
      | undefined,
    deletedInviteCode: (typeof inviteCodes.$inferSelect)[] | undefined;

  [err, matchingInviteCodes] = await to(
    db
      .select()
      .from(inviteCodes)
      // TODO: Create util for the join
      .leftJoin(actors, eq(inviteCodes.code, actors.usedInviteCode))
      .where(
        and(
          eq(inviteCodes.code, parsed.output.inviteCode),
          eq(inviteCodes.issuerId, sessionActor.data.id)
        )
      )
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  // TODO: Create util for the agregator
  const aggregatedOnInviteCode = matchingInviteCodes!.reduce<
    Record<
      string,
      {
        invite_code: typeof inviteCodes.$inferSelect;
        actors: (typeof actors.$inferSelect)[];
      }
    >
  >((acc, row) => {
    const invite_code = row.invite_codes;
    const actor = row.actors;

    if (!acc[invite_code.code]) {
      acc[invite_code.code] = { invite_code, actors: [] };
    }

    if (actor) {
      acc[invite_code.code].actors.push(actor);
    }

    return acc;
  }, {});

  const [inviteCodeWithActors] = Object.values(aggregatedOnInviteCode);

  // TODO: Needs to check if the actors are active, but will do the job for now
  if (inviteCodeWithActors.actors.length) {
    return rpcErrorResponse({
      message:
        "The invite code can't be deleted after it was used, but it can be disabled",
    });
  }

  [err, deletedInviteCode] = await to(
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

  return rpcSuccessResponse(deletedInviteCode![0]);
}

// TODO: Don't update inv code that's been used 5/5
export async function toggleInviteCodeIsEnabled$(formData: FormData) {
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

  const [err, updatedInviteCodes] = await to(
    db
      .update(inviteCodes)
      .set({
        isEnabled: sql` NOT is_enabled`,
      })
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

  return rpcSuccessResponse(updatedInviteCodes[0]);
}
