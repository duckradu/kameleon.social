import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifySensible from "@fastify/sensible";
import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { join } from "path";

import appConfig from "~/config/app";

import { __dirname } from "~/utils/common";
import { logger } from "~/utils/logger";

export const API_PREFIX = "/api/v1";

const MODULE_REGEXP = /.*module(\.ts|\.js|\.cjs|\.mjs)$/;

export function createInstance() {
  const instance = fastify({ logger }).withTypeProvider<TypeBoxTypeProvider>();

  // Utils
  instance.register(fastifySensible);

  // TODO: Add config
  // Security
  instance.register(fastifyCors, appConfig.cors);
  instance.register(fastifyHelmet);

  // Plugins
  instance.register(fastifyCookie, appConfig.cookie);

  instance.register(fastifyAutoload, {
    dir: join(__dirname, "..", "modules"),
    dirNameRoutePrefix: true,
    matchFilter: MODULE_REGEXP,
    indexPattern: MODULE_REGEXP,
    forceESM: true,
    options: { prefix: API_PREFIX },
  });

  return instance;
}
