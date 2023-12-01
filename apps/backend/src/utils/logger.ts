import pino from "pino";

import { __DEV__ } from "~/utils/common";

export const logger = pino({
  level: "debug",
  // Have to pass the config this way as I can't pipe the logs from `tsx` to `pino-pretty` otherwise :(
  ...(__DEV__ && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        ignore: "pid,hostname",
      },
    },
  }),
});
