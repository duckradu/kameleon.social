import { createInstance } from "~/utils/create-instance";

import "~/config/env";

(async function startInstance() {
  const instance = createInstance();

  try {
    await instance.listen({
      host: process.env.HOST,
      port: process.env.PORT,
    });
  } catch (err) {
    process.exit(1);
  }

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
      // TODO: Wrap in `to`
      await instance.close();

      // process.exit(e ? 1 : 0);
    });
  }

  process.on("unhandledRejection", (err) => {
    process.exit(1);
  });
})();
