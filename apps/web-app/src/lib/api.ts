import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";

import { AppRouter } from "~/server/api/root";

import { getBaseUrl } from "~/lib/utils/common";

export const api = createTRPCProxyClient<AppRouter>({
  links: [loggerLink(), httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});
