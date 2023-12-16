import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import dbConfig from "~/config/db";

const pgClient = postgres(dbConfig.dbCredentials.connectionString, { max: 1 });

const db = drizzle(pgClient);

await migrate(db, { migrationsFolder: "drizzle" });

await pgClient.end();
