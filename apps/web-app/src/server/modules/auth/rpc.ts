"use server";

import { redirect } from "@solidjs/router";
import * as argon2 from "argon2";
import { isBefore } from "date-fns/isBefore";
import { decode } from "decode-formdata";
import { count, eq } from "drizzle-orm";
import {
  maxLength,
  minLength,
  object,
  optional,
  safeParseAsync,
  string,
} from "valibot";
import { useSession } from "vinxi/http";

import { sessionConfig } from "~/server/config";

import { db } from "~/server/db";
import { actors } from "~/server/db/schemas/actors";
import { inviteCodes } from "~/server/db/schemas/invite-codes";

import { NANO_LENGTH, to } from "~/lib/utils/common";
import {
  rpcErrorResponse,
  rpcSuccessResponse,
  rpcValidationErrorResponse,
} from "~/lib/utils/rpc";
import { email, password } from "~/lib/utils/validation-schemas";

export function getSession() {
  return useSession<{ actorId: (typeof actors.$inferSelect)["id"] }>(
    sessionConfig
  );
}

export async function getSessionActor$() {
  const session = await getSession();

  const actorId = session.data.actorId;

  if (!actorId) {
    return rpcErrorResponse({ message: "Invalid session" });
  }

  const [err, matchingActors] = await to(
    db.select().from(actors).where(eq(actors.id, actorId))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  if (matchingActors.length !== 1) {
    // TODO: Is this the correct message and/or predicate?
    return rpcErrorResponse({ message: "Invalid session" });
  }

  return rpcSuccessResponse(matchingActors[0]);
}

export async function signUp$(formData: FormData) {
  const sessionActor = await getSessionActor$();

  if (sessionActor?.success) {
    return rpcErrorResponse({ message: "Already authenticated" });
  }

  const [{ count: actorsCount }] = await db
    .select({ count: count() })
    .from(actors);

  const isFirstActor = actorsCount === 0;

  const parsed = await safeParseAsync(
    object({
      ...(!isFirstActor && {
        inviteCode: string([
          minLength(NANO_LENGTH, "The invite code must have 12 characters"),
          maxLength(NANO_LENGTH, "The invite code must have 12 characters"),
        ]),
      }),
      redirectTo: optional(string()),

      email,
      password,
    }),
    decode(formData)
  );

  if (!parsed.success) {
    return rpcValidationErrorResponse(parsed.issues);
  }

  const {
    inviteCode,
    redirectTo,

    password: passwordParsed,

    ...rest
  } = parsed.output;

  let err,
    newActor: (typeof actors.$inferSelect)[] | undefined,
    matchingInviteCodes: (typeof inviteCodes.$inferSelect)[] | undefined;

  if (!isFirstActor) {
    [err, matchingInviteCodes] = await to(
      db
        .select()
        .from(inviteCodes)
        .where(eq(inviteCodes.code, inviteCode as string))
    );

    if (err) {
      return rpcErrorResponse(err);
    }

    if (matchingInviteCodes!.length !== 1) {
      return rpcErrorResponse({
        message: "Invite code invalid",
      });
    }

    if (matchingInviteCodes![0].availableUses === 0) {
      return rpcErrorResponse({
        message: "The invite code can't be used anymore",
      });
    }

    if (isBefore(new Date(matchingInviteCodes![0].expiresAt), new Date())) {
      return rpcErrorResponse({
        message: "The invite code has expired",
      });
    }
  }

  const actorForDB: typeof actors.$inferInsert = {
    ...rest,

    ...((inviteCode as string | undefined)?.length && {
      usedInviteCode: inviteCode as string,
    }),

    encryptedPassword: await argon2.hash(passwordParsed),
  };

  [err, newActor] = await to(db.insert(actors).values(actorForDB).returning());

  if (err) {
    return rpcErrorResponse(err);
  }

  if (newActor!.length !== 1) {
    return rpcErrorResponse({ message: "Internal server error" });
  }

  [err] = await db
    .update(inviteCodes)
    .set({
      availableUses: (matchingInviteCodes?.[0]?.availableUses || 1) - 1,
    })
    .where(eq(inviteCodes.code, inviteCode as string));

  if (err) {
    return rpcErrorResponse(err);
  }

  const session = await getSession();

  await session.update({ actorId: newActor![0].id });

  if (redirectTo?.length) {
    throw redirect(redirectTo);
  }

  return rpcSuccessResponse(newActor![0]);
}

export async function signIn$(formData: FormData) {
  const sessionActor = await getSessionActor$();

  if (sessionActor?.success) {
    return rpcErrorResponse({ message: "Already authenticated" });
  }

  const parsed = await safeParseAsync(
    object({ redirectTo: optional(string()), email, password }),
    decode(formData)
  );

  if (!parsed.success) {
    return rpcValidationErrorResponse(parsed.issues);
  }

  const {
    redirectTo,

    email: emailParsed,
    password: passwordParsed,
  } = parsed.output;

  const [err, matchingActors] = await to(
    db.select().from(actors).where(eq(actors.email, emailParsed))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  if (matchingActors.length !== 1) {
    // TODO: Is this the correct message and/or predicate?
    return rpcErrorResponse({ message: "Invalid credentials" });
  }

  const isValidPassword = await argon2.verify(
    matchingActors[0].encryptedPassword,
    passwordParsed
  );

  if (!isValidPassword) {
    return rpcErrorResponse({ message: "Invalid credentials" });
  }

  const session = await getSession();

  await session.update({ actorId: matchingActors[0].id });

  if (redirectTo?.length) {
    throw redirect(redirectTo);
  }

  return rpcSuccessResponse(matchingActors[0]);
}

export async function signOut$() {
  const session = await getSession();

  await session.update({ actorId: undefined });
}
