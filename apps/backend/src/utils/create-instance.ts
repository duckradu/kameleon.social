import fastifyAutoload from "@fastify/autoload";
import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { join } from "path";

import { __dirname } from "~/utils/common";
import { logger } from "~/utils/logger";

export const API_PREFIX = "/api/v1";

const MODULE_REGEXP = /.*module(\.ts|\.js|\.cjs|\.mjs)$/;

export function createInstance() {
  const instance = fastify({ logger }).withTypeProvider<TypeBoxTypeProvider>();

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
