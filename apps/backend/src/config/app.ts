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

// TODO: Extract hardcoded values to env variables
const corsConfig: FastifyCorsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kameleon.social",
};

// TODO: Extract hardcoded values to env variables
const cookieConfig: FastifyCookieOptions = {
  // TODO: Add secret
  parseOptions: {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
    domain:
      process.env.NODE_ENV === "production" ? ".kameleon.social" : "localhost",
  },
};

export default {
  auth: authConfig,
  cors: corsConfig,
  cookie: cookieConfig,
};
