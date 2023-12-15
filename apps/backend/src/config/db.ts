import { type Config } from "drizzle-kit";

import "~/config/env";

export default {
  out: "./src/db/migrations",
  driver: "pg",
  schema: "./src/modules/**/*.schema.ts",
  dbCredentials: {
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`,
  },
} satisfies Config;
