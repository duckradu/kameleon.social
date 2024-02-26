import { createMiddleware } from "@solidjs/start/middleware";

import { getSessionActor$ } from "~/server/modules/auth/handlers";

// TODO: Type event.local.sessionActor
export default createMiddleware({
  onRequest: [
    async (event) => {
      const sessionActor = await getSessionActor$();

      event.locals.sessionActor = sessionActor?.data;
    },
  ],
});
