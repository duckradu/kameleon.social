import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifySensible from "@fastify/sensible";
import fastify from "fastify";
import { join } from "path";

import voyageClientGenerator from "~/plugins/voyage-client-generator";

import { __dirname } from "~/utils/common";
import { logger } from "~/utils/logger";

import appConfig from "~/config/app";

export const API_PREFIX = "/api/v1";

const MODULE_REGEXP = /.*module(\.ts|\.js|\.cjs|\.mjs)$/;

export function createInstance() {
  const instance = fastify({ logger });

  // Utils
  instance.register(fastifySensible);

  // TODO: Add config
  // Security
  instance.register(fastifyCors, appConfig.cors);
  instance.register(fastifyHelmet);

  // Plugins
  instance.register(fastifyCookie, appConfig.cookie);

  if (process.env.NODE_ENV === "development") {
    instance.register(voyageClientGenerator, {
      prefix: API_PREFIX,
    });
  }

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
