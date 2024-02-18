import { type Config } from "drizzle-kit";

export default {
  out: "./src/server/db/migrations",
  driver: "pg",
  schema: "./src/server/db/schemas/*.ts",
  dbCredentials: {
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`,
  },
} satisfies Config;
