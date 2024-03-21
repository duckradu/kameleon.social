import { action, cache } from "@solidjs/router";

import {
  createRecord$,
  getRecordListByAuthorPid$,
} from "~/server/modules/records/rpc";

export const getRecordListByAuthorPid = cache(
  getRecordListByAuthorPid$,
  "records:get-list-by-author-pid"
);

export const createRecord = action(createRecord$, "records:create");
