import "~/config/env";

import { createInstance } from "~/utils/create-instance";

import { logger } from "~/utils/logger";

(async function startInstance() {
  const instance = createInstance();

  try {
    await instance.listen({
      host: process.env.HOST,
      port: process.env.PORT,
    });
  } catch (err) {
    logger.error(err);

    process.exit(1);
  }

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
      logger.info({ signal }, "Shutting down instance");

      // TODO: Wrap in `to`
      await instance.close();

      // process.exit(e ? 1 : 0);
    });
  }

  process.on("unhandledRejection", (err) => {
    logger.error(err);

    process.exit(1);
  });
})();
