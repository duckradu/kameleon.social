import {
  RouteDefinition,
  cache,
  createAsync,
  redirect,
  useParams,
} from "@solidjs/router";
import { For, Show } from "solid-js";
import { createInfiniteScroll } from "@solid-primitives/pagination";

import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { RecordFeed } from "~/components/record-feed";
import { ShowCreateNewRecordDialogButton } from "~/components/show-create-new-record-dialog-button";

import { db } from "~/server/db";
import {
  actors,
  recordVersions,
  records,
  records as recordsSchema,
} from "~/server/db/schemas";
import { findOneByPID$ } from "~/server/modules/actors/rpc";

import { paths } from "~/lib/constants/paths";
import { sample } from "~/lib/utils/common";
import { rpcSuccessResponse } from "~/lib/utils/rpc";
import { Icon } from "~/components/ui/icon";
import {
  RecordFeedEmptyMessage,
  getDefaultActionList,
} from "~/components/record-feed-empty-message";

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

const getRouteData = cache(async (actorPublicId: string) => {
  "use server";

  const matchingActor = await findOneByPID$(actorPublicId);

  if (!matchingActor) {
    throw redirect(paths.notFound);
  }

  const result = await db.query.records.findMany({
    where: (records, { eq }) => eq(records.authorId, matchingActor.id),
    with: {
      author: true,
      versions: {
        orderBy: (recordVersions, { desc }) => [desc(recordVersions.createdAt)],
        limit: 1,
      },
    },
    orderBy: (records, { desc }) => [desc(records.createdAt)],
  });

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
        latestVersion: typeof recordVersions.$inferSelect;
      })[]
    )
  );
}, "view-actor-activity");

export const route = {
  load: ({ params }) => getRouteData(params.actorPublicId),
} satisfies RouteDefinition;

const fetcher = async (page: number) =>
  await new Promise<string[]>((resolve) =>
    setTimeout(
      () =>
        resolve(
          page === 3
            ? []
            : new Array(50).fill(0).map((_, i) => `${page} - ${i + page + 1}`)
        ),
      1000
    )
  );

// TODO: Fix .space-layout
// TODO: Make fetcher fetch records :D

export default function ActorActivity() {
  const params = useParams();
  const { actor } = useSession();

  const isSessionActor = params.actorPublicId === actor()?.pid;

  const records = createAsync(() => getRouteData(params.actorPublicId));

  const [pages, infiniteScrollLoader, { end }] = createInfiniteScroll(fetcher);

  return (
    <>
      <For each={pages()}>{(page) => <p>{page}</p>}</For>
      <Show
        when={end()}
        fallback={
          <div
            ref={
              infiniteScrollLoader as unknown as (el: HTMLDivElement) => void
            }
            class="py-8 h-full"
          >
            <Icon.spinner class="text-2xl animate-spin mx-auto" />
          </div>
        }
      >
        <RecordFeedEmptyMessage
          actionList={getDefaultActionList().map((actionItem) =>
            actionItem.href === paths.explore.actors
              ? {
                  ...actionItem,
                  href: paths.actor(params.actorPublicId).connections,
                }
              : actionItem
          )}
        />
      </Show>
    </>
    // <Show
    //   when={records()?.data?.length}
    //   fallback={
    //     <ProfilePageEmptyMessage
    //       title={
    //         isSessionActor
    //           ? sample(NO_DATA_MESSAGES.title)
    //           : sample(NO_DATA_MESSAGES_VISITOR.title(params.actorPublicId))
    //       }
    //       description={
    //         isSessionActor
    //           ? sample(NO_DATA_MESSAGES.description)
    //           : sample(NO_DATA_MESSAGES_VISITOR.description)
    //       }
    //     >
    //       <Show when={isSessionActor}>
    //         <ShowCreateNewRecordDialogButton />
    //       </Show>
    //     </ProfilePageEmptyMessage>
    //   }
    // >
    //   <RecordFeed
    //     recordList={
    //       records()!.data! as (typeof recordsSchema.$inferSelect & {
    //         author: typeof actors.$inferSelect;
    //         latestVersion: typeof recordVersions.$inferSelect;
    //       })[]
    //     }
    //     class="py-layout" // TODO: Don't forget about this
    //   />
    // </Show>
  );
}
