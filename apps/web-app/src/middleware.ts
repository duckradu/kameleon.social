import { createMiddleware } from "@solidjs/start/middleware";

import { authMiddleware } from "~/server/modules/auth/middleware";

// TODO: Type event.local.sessionActor
export default createMiddleware({
  onRequest: [authMiddleware],
});
