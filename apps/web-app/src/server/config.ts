import { SessionConfig } from "vinxi/http";

export const sessionConfig = {
  password:
    process.env.SESSION_SECRET ||
    "secretveryveryveryverysecretsecretsecretsecret", // TODO: Get rid of the default value
} as SessionConfig;
