import { RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { RecordFeed } from "~/components/record-feed";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import {
  actors,
  recordVersions,
  records as recordsSchema,
} from "~/server/db/schemas";
import { getRecordListByAuthorPid } from "~/server/modules/records/actions";

import { sample } from "~/lib/utils/common";

const NO_DATA_MESSAGES = {
  title: [
    "Nothing to see here, yet",
    "This is your blank canvas",
    "Ready to make your mark?",
  ],
  description: [
    "Your profile is waiting for your stories to unfold...",
    "Your profile is ready for your first post!",
    "Let's fill it with your experiences!",
    "Welcome to your personal page! Start sharing your journey...",
    "Your profile is your space to shine!",
    "Your profile page is like a book waiting for its first chapter. Begin writing!",
  ],
};

export const route = {
  load: ({ params }) => getRecordListByAuthorPid(params.actorPublicId),
} satisfies RouteDefinition;

export default function ActorActivity() {
  const params = useParams();

  const records = createAsync(() =>
    getRecordListByAuthorPid(params.actorPublicId)
  );

  return (
    <Show
      when={records()?.data?.length}
      fallback={
        <ProfilePageEmptyMessage
          title={sample(NO_DATA_MESSAGES.title)}
          description={sample(NO_DATA_MESSAGES.description)}
        >
          <Button size="lg">
            <Icon.signature.outline class="text-lg -ml-1" />
            Post
          </Button>
        </ProfilePageEmptyMessage>
      }
    >
      <RecordFeed
        recordList={
          records()!.data! as (typeof recordsSchema.$inferSelect & {
            author: typeof actors.$inferSelect;
            latestVersion: typeof recordVersions.$inferSelect;
          })[]
        }
        class="py-layout"
      />
    </Show>
  );
}
