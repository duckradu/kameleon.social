import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import config from "~/server/db/config";

const migrationClient = postgres(config.dbCredentials.connectionString, {
  max: 1,
});

await migrate(drizzle(migrationClient), { migrationsFolder: config.out });

await migrationClient.end();
