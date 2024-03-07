import { action, cache } from "@solidjs/router";

import {
  createInviteCode$,
  deleteInviteCode$,
  getInviteCodes$,
} from "~/server/modules/invite-codes/rpc";

export const getInviteCodes = cache(getInviteCodes$, "invite-codes:get");

export const createInviteCode = action(
  createInviteCode$,
  "invite-codes:create"
);

export const deleteInviteCode = action(
  deleteInviteCode$,
  "invite-codes:delete"
);
