import { action } from "@solidjs/router";

import {
  createInviteCode$,
  deleteInviteCode$,
  toggleInviteCodeIsEnabled$,
} from "~/server/modules/invite-codes/rpc";

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
