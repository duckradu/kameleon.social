"use server";

import { redirect } from "@solidjs/router";
import * as argon2 from "argon2";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import { object, optional, safeParseAsync, string } from "valibot";
import { useSession } from "vinxi/http";

import { db } from "~/server/db";
import { actors } from "~/server/db/schemas/actors";

import { to } from "~/lib/utils/common";
import {
  rpcErrorResponse,
  rpcSuccessResponse,
  rpcValidationErrorResponse,
} from "~/lib/utils/rpc";
import { email, password } from "~/lib/utils/validation-schemas";

import { sessionConfig } from "~/server/config";

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

  const [err, matchingActor] = await to(
    db.select().from(actors).where(eq(actors.id, actorId))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  if (matchingActor.length !== 1) {
    // TODO: Is this the correct message and/or predicate?
    return rpcErrorResponse({ message: "Invalid session" });
  }

  return rpcSuccessResponse(matchingActor[0]);
}

export async function signUp$(formData: FormData) {
  const sessionActor = await getSessionActor$();

  if (sessionActor?.success) {
    return rpcErrorResponse({ message: "Already authenticated" });
  }

  const parsed = await safeParseAsync(
    object({
      inviteCode: optional(string()),
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

  const actorForDB: typeof actors.$inferInsert = {
    ...rest,

    encryptedPassword: await argon2.hash(passwordParsed),
  };

  const [err, newActor] = await to(
    db.insert(actors).values(actorForDB).returning()
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  if (newActor.length !== 1) {
    return rpcErrorResponse({ message: "Internal server error" });
  }

  const session = await getSession();

  await session.update({ actorId: newActor[0].id });

  if (redirectTo?.length) {
    throw redirect(redirectTo);
  }

  return rpcSuccessResponse(newActor[0]);
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

  const [err, matchingActor] = await to(
    db.select().from(actors).where(eq(actors.email, emailParsed))
  );

  if (err) {
    return rpcErrorResponse(err);
  }

  if (matchingActor.length !== 1) {
    // TODO: Is this the correct message and/or predicate?
    return rpcErrorResponse({ message: "Invalid credentials" });
  }

  const isValidPassword = await argon2.verify(
    matchingActor[0].encryptedPassword,
    passwordParsed
  );

  if (!isValidPassword) {
    return rpcErrorResponse({ message: "Invalid credentials" });
  }

  const session = await getSession();

  await session.update({ actorId: matchingActor[0].id });

  if (redirectTo?.length) {
    throw redirect(redirectTo);
  }

  return rpcSuccessResponse(matchingActor[0]);
}

export async function signOut$() {
  const session = await getSession();

  await session.update({ actorId: undefined });
}
