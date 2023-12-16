import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimiter from "@fastify/rate-limit";
import fastifySensible from "@fastify/sensible";
import fastify from "fastify";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import voyageClientGenerator from "~/plugins/voyage-client-generator";

import { logger } from "~/utils/logger";

import appConfig from "~/config/app";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const API_PREFIX = "/api/v1";

const MODULE_REGEXP = /.*module(\.ts|\.js|\.cjs|\.mjs)$/;

export function createInstance() {
  const instance = fastify({ logger });

  // Utils
  instance.register(fastifySensible);
  instance.register(fastifyCookie, appConfig.cookie);

  // Security
  instance.register(fastifyCors, appConfig.cors);
  instance.register(fastifyHelmet);

  // Plugins
  instance.register(fastifyRateLimiter, appConfig.rateLimiter);

  // TODO: Extract this from plugin to a generator
  if (process.env.NODE_ENV === "development") {
    instance.register(voyageClientGenerator, {
      prefix: API_PREFIX,
    });
  }

  // TODO: Add not found handler with rate limiter

  // Modules
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
