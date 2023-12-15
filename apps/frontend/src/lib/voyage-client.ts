import { createVoyageClient } from "@kameleon.social/backend/generated/voyage-client";

import { absoluteFetch } from "~/lib/absolute-fetch";

export const voyage = createVoyageClient(
  (url, method) => async (payload: any) => {
    const response = await absoluteFetch<typeof payload>(url, {
      method,
      body: payload,
    });

    if (!response.ok) {
      throw new Error("HTTPError");
    }

    return await response.json();
  }
);
