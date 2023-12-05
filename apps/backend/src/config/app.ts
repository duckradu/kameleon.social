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
  origin: (origin, cb) => {
    if (origin) {
      // TODO: Only allow localhost in dev
      // TODO: Add config for prod
      const { hostname } = new URL(origin);

      if (hostname === "localhost") {
        cb(null, true);

        return;
      }

      cb(new Error("Not allowed"), false);
    } else {
      cb(null, false);
    }
  },
};

const cookieConfig: FastifyCookieOptions = {
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
