import { RequestMiddleware } from "@solidjs/start/middleware";

import { getSessionActor$ } from "~/server/modules/auth/handlers";

export const authMiddleware: RequestMiddleware = async (event) => {
  const sessionActor = await getSessionActor$();

  event.locals.sessionActor = sessionActor;
};
