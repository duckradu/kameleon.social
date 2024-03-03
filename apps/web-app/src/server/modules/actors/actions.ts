import { cache } from "@solidjs/router";

import { findOneByPID$ } from "~/server/modules/actors/rpc";

export const findOneByPID = cache(findOneByPID$, "actors:findOneByPID");
