"use server";

import * as argon2 from "argon2";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import { object, safeParseAsync } from "valibot";
import { useSession } from "vinxi/http";

import { db } from "~/server/db";
import { actors } from "~/server/db/schemas/actors";

import {
  serverErrorResponse,
  serverParseErrorResponse,
  serverSuccessResponse,
} from "~/lib/utils/server";
import { email, password } from "~/lib/utils/validation-schemas";
import { to } from "~/lib/utils/common";

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
    return null;
  }

  const [err, matchingActor] = await to(
    db.select().from(actors).where(eq(actors.id, actorId))
  );

  if (err) {
    return serverErrorResponse(err);
  }

  // TODO: Check matchingActor length before returning
  return serverSuccessResponse(matchingActor[0]);
}

export async function signUp$(formData: FormData) {
  const parsed = await safeParseAsync(
    object({ email, password }),
    decode(formData)
  );

  if (!parsed.success) {
    return serverParseErrorResponse(parsed.issues);
  }

  const { password: passwordParsed, ...rest } = parsed.output;

  const actorForDB: typeof actors.$inferInsert = {
    ...rest,

    encryptedPassword: await argon2.hash(passwordParsed),
  };

  const [err, newActor] = await to(
    db.insert(actors).values(actorForDB).returning()
  );

  if (err) {
    return serverErrorResponse(err);
  }

  const session = await getSession();

  await session.update({ actorId: newActor[0].id });

  return serverSuccessResponse(newActor[0]);
}

export async function signIn$(formData: FormData) {
  const parsed = await safeParseAsync(
    object({ email, password }),
    decode(formData)
  );

  if (!parsed.success) {
    return serverParseErrorResponse(parsed.issues);
  }

  const { email: emailParsed, password: passwordParsed } = parsed.output;

  const [err, matchingActor] = await to(
    db.select().from(actors).where(eq(actors.email, emailParsed))
  );

  if (err) {
    return serverErrorResponse(err);
  }

  // TODO: Handle better mathcingActor.length === 0
  if (!matchingActor[0]) {
    return serverErrorResponse({ message: "401 invalid credentials" });
  }

  const isValid = await argon2.verify(
    matchingActor[0].encryptedPassword,
    passwordParsed
  );

  if (!isValid) {
    return serverErrorResponse({ message: "401 invalid credentials" });
  }

  const session = await getSession();

  await session.update({ actorId: matchingActor[0].id });

  return serverSuccessResponse(matchingActor[0]);
}

export async function signOut$() {
  const session = await getSession();

  await session.update({ actorId: undefined });

  return serverSuccessResponse();
}
