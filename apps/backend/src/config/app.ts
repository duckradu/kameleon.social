import { type FastifyCookieOptions } from "@fastify/cookie";
import { type FastifyCorsOptions } from "@fastify/cors";

const authConfig = {
  accessToken: {
    salt: "access_token",
    name: "access_token",
    maxAge: 60 * 60,
  },
  refreshToken: {
    salt: "refresh_token",
    name: "refresh_token",
    maxAge: 7 * 24 * 60 * 60,
  },
};

const corsConfig: FastifyCorsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "development" ? "*" : "https://kameleon.social",
};

const cookieConfig: FastifyCookieOptions = {
  // TODO: Add secret
  parseOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
  },
};

export default {
  auth: authConfig,
  cors: corsConfig,
  cookie: cookieConfig,
};
