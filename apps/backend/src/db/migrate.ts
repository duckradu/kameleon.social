import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { dirname, join } from "path";
import postgres from "postgres";
import { fileURLToPath } from "url";

import dbConfig from "~/config/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pgClient = postgres(dbConfig.dbCredentials.connectionString, { max: 1 });

const db = drizzle(pgClient);

await migrate(db, { migrationsFolder: join(__dirname, "migrations") });

await pgClient.end();
