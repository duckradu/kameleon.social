import addMinutes from "date-fns/addMinutes";
import { InferSelectModel, and, eq, lte } from "drizzle-orm";

import { db } from "~/db";

import { actors } from "~/modules/actors/actors.schema";
import { authRefreshTokens } from "~/modules/auth/auth.schema";

import {
  generateAccessToken,
  generateRefreshToken,
  type JwtPayload,
} from "~/modules/auth/auth.utils";

export async function createTokenSession(
  actorId: InferSelectModel<typeof actors>["id"],
  actorPublicId: InferSelectModel<typeof actors>["publicId"]
) {
  const access = await generateAccessToken({
    sub: actorPublicId,
  });
  const refresh = await generateRefreshToken({
    sub: actorPublicId,
  });

  await storeRefreshToken(actorId, refresh.config);

  return { access, refresh };
}

export async function storeRefreshToken(
  actorId: InferSelectModel<typeof actors>["id"],
  config: Awaited<ReturnType<typeof generateRefreshToken>>["config"]
) {
  return await db
    .insert(authRefreshTokens)
    .values({
      id: config.jti,
      actorId,
      expiresAt: new Date(config.exp * 1000).toISOString(),
    })
    .returning();
}

export async function rotateRefreshToken(
  tokenId: NonNullable<JwtPayload["jti"]>,
  actorPublicId: InferSelectModel<typeof actors>["publicId"]
) {
  const [matchingToken] = await db
    .select()
    .from(authRefreshTokens)
    .where(eq(authRefreshTokens.id, tokenId));

  if (!matchingToken) {
    return null;
  }

  const now = new Date();

  await deleteExpiredRefreshTokens(matchingToken.actorId, now);

  const currentExpiresAt = new Date(matchingToken.expiresAt);
  const extendedExpiresAt = addMinutes(currentExpiresAt, 15);

  const nextExpiresAt =
    extendedExpiresAt < currentExpiresAt ? extendedExpiresAt : currentExpiresAt;

  if (nextExpiresAt < now) {
    return null;
  }

  await db
    .update(authRefreshTokens)
    .set({
      expiresAt: nextExpiresAt.toISOString(),
    })
    .where(eq(authRefreshTokens.id, matchingToken.id));

  const { access, refresh } = await createTokenSession(
    matchingToken.actorId,
    actorPublicId
  );

  return { access, refresh };
}

export async function deleteExpiredRefreshTokens(
  actorId: InferSelectModel<typeof actors>["id"],
  now: Date = new Date()
) {
  return await db
    .delete(authRefreshTokens)
    .where(
      and(
        eq(authRefreshTokens.actorId, actorId),
        lte(authRefreshTokens.expiresAt, now.toISOString())
      )
    )
    .returning();
}

export async function deleteRefreshToken(
  tokenId: NonNullable<JwtPayload["jti"]>
) {
  return await db
    .delete(authRefreshTokens)
    .where(eq(authRefreshTokens.id, tokenId))
    .returning();
}

export async function deleteRefreshTokensForActor(
  actorId: InferSelectModel<typeof actors>["id"]
) {
  return await db
    .delete(authRefreshTokens)
    .where(eq(authRefreshTokens.actorId, actorId))
    .returning();
}
