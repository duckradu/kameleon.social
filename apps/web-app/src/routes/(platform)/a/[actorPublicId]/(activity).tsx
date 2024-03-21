import { RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useSession } from "~/components/context/session";
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

const NO_DATA_MESSAGES_VISITOR = {
  title: (actorPublicId: string) => [
    `No posts from @${actorPublicId} as of yet.`,
    `Currently no content from @${actorPublicId}.`,
    `Empty feed from @${actorPublicId} for now.`,
    `Still waiting for @${actorPublicId}'s first post.`,
    `The feed from @${actorPublicId} is empty.`,
    `No activity yet from @${actorPublicId}.`,
    `Nothing from @${actorPublicId} on the feed.`,
    `Currently no posts from @${actorPublicId}.`,
  ],
  description: [
    "Stay tuned for updates once they start sharing!",
    "Keep an eye out for their debut post!",
    "Their posts will be showcased here once they start.",
    "Stay tuned!",
    "Their posts will populate this space once they begin.",
    "Keep watching for their first post!",
    "Stay tuned for their upcoming posts!",
    "But when they start posting, you'll see their updates here!",
  ],
};

export const route = {
  load: ({ params }) => getRecordListByAuthorPid(params.actorPublicId),
} satisfies RouteDefinition;

export default function ActorActivity() {
  const params = useParams();
  const { actor } = useSession();

  const isSessionActor = params.actorPublicId === actor()?.pid;

  const records = createAsync(() =>
    getRecordListByAuthorPid(params.actorPublicId)
  );

  return (
    <Show
      when={records()?.data?.length}
      fallback={
        <ProfilePageEmptyMessage
          title={
            isSessionActor
              ? sample(NO_DATA_MESSAGES.title)
              : sample(NO_DATA_MESSAGES_VISITOR.title(params.actorPublicId))
          }
          description={
            isSessionActor
              ? sample(NO_DATA_MESSAGES.description)
              : "When they do"
          }
        >
          <Show when={isSessionActor}>
            <Button size="lg">
              <Icon.signature.outline class="text-lg -ml-1" />
              Post
            </Button>
          </Show>
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
