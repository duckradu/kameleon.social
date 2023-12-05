import hkdf from "@panva/hkdf";
import crypto from "crypto";
import { type FastifyInstance, type FastifyRequest } from "fastify";
import * as jose from "jose";

import appConfig from "~/config/app";

declare module "fastify" {
  export interface FastifyRequest {
    accessTokenDecoded?: Awaited<ReturnType<typeof decode>>;
    refreshTokenDecoded?: Awaited<ReturnType<typeof decode>>;
  }
}

export interface JwtPayload extends jose.JWTPayload {}

export async function encode<TPayload extends JwtPayload>(
  payload: TPayload,
  secret: string,
  salt: string,
  maxAge: number = 30 * 24 * 60 * 60
) {
  const encryptionSecret = await getDerivedEncryptionKey(secret, salt);

  const jti = payload.jti || generateJti();
  const exp = payload.exp || Date.now() / 1000 + maxAge;

  const token = await new jose.EncryptJWT(payload)
    .setProtectedHeader({
      alg: "dir",
      enc: "A256GCM",
    })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(exp)
    .encrypt(encryptionSecret);

  return { token, config: { jti, exp } };
}

export async function decode<
  TPayload extends RequiredKeys<JwtPayload, "jti" | "sub" | "exp">
>(token: string, secret: string, salt: string) {
  const encryptionSecret = await getDerivedEncryptionKey(secret, salt);

  const { payload } = await jose.jwtDecrypt<TPayload>(token, encryptionSecret, {
    clockTolerance: 15,
  });

  return payload;
}

export async function generateAccessToken(
  payload: Parameters<typeof encode>[0]
) {
  return await encode(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    appConfig.auth.accessToken.salt,
    appConfig.auth.accessToken.maxAge
  );
}

export async function generateRefreshToken(
  payload: Parameters<typeof encode>[0]
) {
  return await encode(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    appConfig.auth.refreshToken.salt,
    appConfig.auth.refreshToken.maxAge
  );
}

export function generateJti() {
  return crypto.randomBytes(32).toString("base64");
}

async function getDerivedEncryptionKey(
  key: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  return await hkdf(
    "sha256",
    key,
    salt,
    `kameleon.social Generated Encryption Key (${salt})`,
    32
  );
}

export function extractAccessToken(request: FastifyRequest) {
  const {
    headers: { authorization: authHeader },
  } = request;

  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer") {
    return null;
  }

  return token;
}

export function extractRefreshToken(request: FastifyRequest) {
  const { cookies } = request;

  const authCookie = cookies[appConfig.auth.refreshToken.name];

  if (!authCookie) {
    return null;
  }

  return authCookie;
}

export async function verifyAccessToken(
  this: FastifyInstance,
  request: FastifyRequest
) {
  const accessToken = extractAccessToken(request);

  this.assert(accessToken, 401, "Unauthorized");

  const [err, decoded] = await this.to(
    decode(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      appConfig.auth.accessToken.salt
    )
  );

  this.assert(!err, 401, "Invalid access token");

  request.accessTokenDecoded = decoded;
}

export async function verifyRefreshToken(
  this: FastifyInstance,
  request: FastifyRequest
) {
  const refreshToken = extractRefreshToken(request);

  this.assert(refreshToken, 401, "Unauthorized");

  const [err, decoded] = await this.to(
    decode(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      appConfig.auth.refreshToken.salt
    )
  );

  this.assert(!err, 401, "Invalid refresh token");

  request.refreshTokenDecoded = decoded;
}

export async function verifyNoAccessToken(
  this: FastifyInstance,
  request: FastifyRequest
) {
  const token = extractAccessToken(request);

  this.assert(!token, 401, "Already logged in");

  request.accessTokenDecoded = undefined;
}

export async function verifyNoRefreshToken(
  this: FastifyInstance,
  request: FastifyRequest
) {
  const token = extractRefreshToken(request);

  this.assert(!token, 401, "Already logged in");

  request.refreshTokenDecoded = undefined;
}
