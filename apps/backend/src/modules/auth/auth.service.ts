import { addMinutes } from "date-fns";
import { InferSelectModel, and, eq, lte } from "drizzle-orm";

import { db } from "~/db";

import { actors } from "~/modules/actors/actors.schema";
import { refreshTokens } from "~/modules/auth/auth.schema";

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
    .insert(refreshTokens)
    .values({
      id: config.jti,
      actorId,
      expiresAt: new Date(config.exp * 1000).toISOString(),
    })
    .returning();
}

// * Refactor to return errors/error codes instead of null?
export async function rotateRefreshToken(
  tokenId: NonNullable<JwtPayload["jti"]>,
  actorPublicId: InferSelectModel<typeof actors>["publicId"]
) {
  const [matchingToken] = await db
    .select()
    .from(refreshTokens)
    // * REMINDER: I have not tested this
    .innerJoin(actors, eq(actors.publicId, actorPublicId))
    .where(eq(refreshTokens.id, tokenId));

  if (!matchingToken) {
    return null;
  }

  const { refresh_tokens: refreshToken } = matchingToken;

  const now = new Date();

  await deleteRefreshTokensForActor(refreshToken.actorId, now);

  const currentExpiresAt = new Date(refreshToken.expiresAt);
  const extendedExpiresAt = addMinutes(now, 15);

  const nextExpiresAt =
    extendedExpiresAt < currentExpiresAt ? extendedExpiresAt : currentExpiresAt;

  if (nextExpiresAt < now) {
    return null;
  }

  await db
    .update(refreshTokens)
    .set({
      expiresAt: nextExpiresAt.toISOString(),
    })
    .where(eq(refreshTokens.id, refreshToken.id));

  const { access, refresh } = await createTokenSession(
    refreshToken.actorId,
    actorPublicId
  );

  return { access, refresh };
}

export async function deleteRefreshToken(
  tokenId: NonNullable<JwtPayload["jti"]>
) {
  return await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.id, tokenId))
    .returning();
}

export async function deleteRefreshTokensForActor(
  actorId: InferSelectModel<typeof actors>["id"],
  now?: Date
) {
  return await db
    .delete(refreshTokens)
    .where(
      and(
        eq(refreshTokens.actorId, actorId),
        now ? lte(refreshTokens.expiresAt, now.toISOString()) : undefined
      )
    )
    .returning();
}
