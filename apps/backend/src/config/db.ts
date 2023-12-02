import { type Config } from "drizzle-kit";

import "~/config/env";

export default {
  out: "./src/db/migrations",
  driver: "pg",
  schema: "./src/modules/**/*.schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
