import { Static, Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import envSchema from "env-schema";

const env = dotenv.config();

dotenvExpand.expand(env);

export const schema = Type.Object({
  HOST: Type.String({ default: "0.0.0.0" }),
  PORT: Type.Number({ default: 3100 }),

  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),

  DATABASE_HOST: Type.String(),
  DATABASE_PORT: Type.Number(),

  DATABASE_URL: Type.String(),

  COOKIE_SECRET: Type.String(),

  ACCESS_TOKEN_SECRET: Type.String(),
  REFRESH_TOKEN_SECRET: Type.String(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Static<typeof schema> {}
  }
}

envSchema({ schema });
