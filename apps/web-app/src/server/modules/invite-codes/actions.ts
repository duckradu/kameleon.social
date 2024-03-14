import { action, cache } from "@solidjs/router";

import {
  createInviteCode$,
  deleteInviteCode$,
  getInviteCodes$,
  toggleInviteCodeIsEnabled$,
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

export const toggleInviteCodeIsEnabled = action(
  toggleInviteCodeIsEnabled$,
  "invite-codes:toggle-is_enabled"
);
