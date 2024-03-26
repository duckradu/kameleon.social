import { cache } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { For, Show } from "solid-js";

import { useActorRoute } from "~/components/context/actor-route";
import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { Record } from "~/components/record";
import {
  RecordFeedEmptyMessage,
  getDefaultActionList,
} from "~/components/record-feed-empty-message";
import { ShowCreateNewRecordDialogButton } from "~/components/show-create-new-record-dialog-button";
import { Icon } from "~/components/ui/icon";

import { actors, recordVersions, records } from "~/server/db/schemas";
import { getRecordsPage$ } from "~/server/modules/records/rpc";

import { createInfiniteScroll } from "~/lib/primitives/create-infinite-scroll";

import { sample } from "~/lib/utils/common";
import { rpcSuccessResponse } from "~/lib/utils/rpc";

import { paths } from "~/lib/constants/paths";

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

const routeData = cache(
  async (actorId: (typeof actors.$inferSelect)["id"], cursor?: string) => {
    "use server";

    const result = await getRecordsPage$(eq(records.authorId, actorId), cursor);

    if (!result.length) {
      return rpcSuccessResponse([]);
    }

    return rpcSuccessResponse(
      result.reduce(
        (acc, { versions, ...curr }) => [
          ...acc,
          { ...curr, latestVersion: versions[0] },
        ],
        [] as (typeof records.$inferSelect & {
          author: typeof actors.$inferSelect;
          latestVersion: typeof recordVersions.$inferSelect;
        })[]
      )
    );
  },
  "actor:activity"
);

export default function ActorActivity() {
  const { actor: sessionActor } = useSession();
  const { actor } = useActorRoute();

  const isSessionActor = sessionActor() && sessionActor()!.id === actor().id;

  const [infiniteRecords, infiniteScrollLoader, { source, end }] =
    createInfiniteScroll(
      async (source) => {
        const response = await routeData(source.actorId, source.cursor);

        if (response.success) {
          return response.data;
        }

        return [];
      },
      {
        initialSource: {
          actorId: actor().id,
          cursor: "",
        },
        getNextSource: ({ content }) => ({
          actorId: actor().id,
          cursor: content().at(-1)?.createdAt || "",
        }),
      }
    );

  return (
    <Show
      when={!(source().cursor === "" && infiniteRecords().length === 0)}
      fallback={
        <ProfilePageEmptyMessage
          title={
            isSessionActor
              ? sample(NO_DATA_MESSAGES.title)
              : sample(NO_DATA_MESSAGES_VISITOR.title(actor().pid))
          }
          description={
            isSessionActor
              ? sample(NO_DATA_MESSAGES.description)
              : sample(NO_DATA_MESSAGES_VISITOR.description)
          }
        >
          <Show when={isSessionActor}>
            <ShowCreateNewRecordDialogButton />
          </Show>
        </ProfilePageEmptyMessage>
      }
    >
      <div class="grid gap-layout">
        <For each={infiniteRecords()}>{(record) => <Record {...record} />}</For>
      </div>

      <Show
        when={!end()}
        fallback={
          <RecordFeedEmptyMessage
            actionList={getDefaultActionList().map((actionItem) =>
              actionItem.href === paths.explore.actors
                ? {
                    ...actionItem,
                    href: paths.actor(actor().pid).connections,
                  }
                : actionItem
            )}
          />
        }
      >
        <div ref={infiniteScrollLoader} class="py-8 h-full">
          <Icon.spinner class="text-2xl animate-spin mx-auto" />
        </div>
      </Show>
    </Show>
  );
}
