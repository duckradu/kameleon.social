import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "~/server/db/schemas";

import config from "~/server/db/config";

const queryClient = postgres(config.dbCredentials.connectionString);

export const db = drizzle(queryClient, { schema });
