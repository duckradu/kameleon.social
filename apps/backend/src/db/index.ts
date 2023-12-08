// ! Do not modify this file unless you know what you are doing.
// ! Any changes will be overwritten by the next `pnpm db:generate-root`.
// ! To update the generated output look inside `/bin/generate-db-root.ts`

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as actorsSchema from "~/modules/actors/actors.schema";
import * as authSchema from "~/modules/auth/auth.schema";

const queryClient = postgres(process.env.DATABASE_URL);

export const db = drizzle(queryClient, {
  schema: {
    actors: actorsSchema,
    auth: authSchema,
  },
});
