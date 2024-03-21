import { RouteDefinition, createAsync, useParams } from "@solidjs/router";

import { RecordFeed } from "~/components/record-feed";

import { getRecordListByAuthorPid } from "~/server/modules/records/actions";

export const route = {
  load: ({ params }) => getRecordListByAuthorPid(params.actorPublicId),
} satisfies RouteDefinition;

export default function ActorActivity() {
  const params = useParams();

  const records = createAsync(() =>
    getRecordListByAuthorPid(params.actorPublicId)
  );

  return (
    <RecordFeed
      recordList={(records()?.data || []) as any[]}
      class="py-layout"
    />
  );
}
