import { action } from "@solidjs/router";

import { createRecord$ } from "~/server/modules/records/rpc";

export const createRecord = action(createRecord$, "records:create");
