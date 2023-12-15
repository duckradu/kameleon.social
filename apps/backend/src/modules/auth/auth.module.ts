import { Static, Type } from "@sinclair/typebox";
import * as argon2 from "argon2";
import { FastifyInstance } from "fastify";

import { publicSelectActorSchema } from "~/modules/actors/actors.schema";
import { signInWithCredentialsSchema } from "~/modules/auth/auth.schema";

import * as ActorsService from "~/modules/actors/actors.service";
import * as AuthService from "~/modules/auth/auth.service";

import {
  verifyAccessToken,
  verifyNoRefreshToken,
  verifyRefreshToken,
} from "~/modules/auth/auth.utils";

import appConfig from "~/config/app";

const publicAccessTokenSchema = Type.Object(
  {
    accessToken: Type.String(),
  },
  {
    title: "publicAccessTokenSchema",
  }
);

export default async function (instance: FastifyInstance) {
  instance.route<{
    Body: Static<typeof signInWithCredentialsSchema>;
  }>({
    url: "/",
    method: "POST",
    schema: {
      body: signInWithCredentialsSchema,
      response: {
        200: publicAccessTokenSchema,
      },
    },
    preHandler: verifyNoRefreshToken,
    handler: async (request, reply) => {
      const { body } = request;

      const [matchingActor] = await ActorsService.findByEmail(body.email);

      instance.assert(matchingActor, 401, "Invalid credentials");

      const passwordVerified = await argon2.verify(
        matchingActor.hashedPassword,
        body.password
      );

      instance.assert(passwordVerified, 401, "Invalid credentials");

      const [err, { access, refresh }] = await instance.to(
        AuthService.createTokenSession(matchingActor.id, matchingActor.publicId)
      );

      instance.assert(!err, 500, "Failed to create authentication tokens");

      reply.setCookie(appConfig.auth.refreshToken.name, refresh.token, {
        maxAge: appConfig.auth.refreshToken.maxAge,
      });

      return { accessToken: access.token };
    },
  });

  instance.route({
    url: "/",
    method: "GET",
    schema: {
      response: {
        200: publicSelectActorSchema,
      },
    },
    preHandler: verifyAccessToken,
    handler: async (request) => {
      const { accessTokenDecoded: decoded } = request;

      const [matchingActor] = await ActorsService.findByPublicId(decoded!.sub);

      return matchingActor;
    },
  });

  instance.route({
    url: "/",
    method: "PATCH",
    handler: async (_, reply) => {
      return reply.notImplemented();
    },
  });

  instance.route({
    url: "/",
    method: "DELETE",
    preHandler: verifyRefreshToken,
    handler: async (request, reply) => {
      const { refreshTokenDecoded: decoded } = request;

      await AuthService.deleteRefreshToken(decoded!.jti);

      reply.clearCookie(appConfig.auth.refreshToken.name);

      return reply.status(204).send();
    },
  });

  instance.route({
    url: "/refresh",
    method: "POST",
    schema: {
      response: {
        200: publicAccessTokenSchema,
      },
    },
    preHandler: verifyRefreshToken,
    handler: async (request, reply) => {
      const { refreshTokenDecoded: decoded } = request;

      const newTokens = await AuthService.rotateRefreshToken(
        decoded!.jti,
        decoded!.sub
      );

      instance.assert(newTokens, 500, "Failed to create new tokens");

      const { access, refresh } = newTokens;

      reply.setCookie(appConfig.auth.refreshToken.name, refresh.token, {
        maxAge: appConfig.auth.refreshToken.maxAge,
      });

      return { accessToken: access.token };
    },
  });
}
