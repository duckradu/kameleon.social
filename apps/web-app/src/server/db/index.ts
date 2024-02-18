import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import config from "~/server/db/config";

const queryClient = postgres(config.dbCredentials.connectionString);

export const db = drizzle(queryClient);
