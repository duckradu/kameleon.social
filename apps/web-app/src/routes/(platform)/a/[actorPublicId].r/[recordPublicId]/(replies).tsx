import { cache } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { For, Show, createSignal } from "solid-js";

import { Composer } from "~/components/composer/composer";
import { useRecordRoute } from "~/components/context/record-route";
import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { Record } from "~/components/record";
import { RecordFeedEmptyMessage } from "~/components/record-feed-empty-message";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { recordVersions, records } from "~/server/db/schemas";
import { getRecordsPage$ } from "~/server/modules/records/rpc";

import { createInfiniteScroll } from "~/lib/primitives/create-infinite-scroll";

import { sample } from "~/lib/utils/common";
import { rpcSuccessResponse } from "~/lib/utils/rpc";

const NO_DATA_MESSAGES = {
  title: [
    "Lead the discussion",
    "Initiate the conversation",
    "Be the first to reply",
    "Kickstart the dialogue",
    "Break the silence",
    "Get talking, engage",
  ],
  description: [
    "Be the first the share your opinion",
    "No responses yet, yours can be the first",
    "Make your voice heard on this post",
    "Join the interaction - be the first to respond",
    "Ignite discussion - your response can get things going",
    "Don't wait, be the first to the party",
  ],
};

const routeData = cache(
  async (
    parentRecordId: (typeof records.$inferSelect)["id"],
    cursor?: string
  ) => {
    "use server";

    const matchingReplies = await getRecordsPage$(
      eq(records.parentRecordId, parentRecordId),
      cursor
    );

    return rpcSuccessResponse(
      matchingReplies.reduce(
        (acc, { versions, ...curr }) => [
          ...acc,
          { ...curr, latestVersion: versions[0] },
        ],
        [] as (typeof records.$inferSelect & {
          latestVersion: typeof recordVersions.$inferSelect;
        })[]
      ) || []
    );
  },
  "record:replies"
);

export default function RecordReplies() {
  const { actor } = useSession();
  const { record } = useRecordRoute();

  const [infiniteReplies, infiniteScrollLoader, { source, end }] =
    createInfiniteScroll(
      async (source) => {
        const response = await routeData(source.recordId, source.cursor);

        if (response.success) {
          return response.data;
        }

        return [];
      },
      {
        initialSource: {
          recordId: record().id,
          cursor: "",
        },
        getNextSource: ({ content }) => ({
          recordId: record().id,
          cursor: content().at(-1)?.createdAt || "",
        }),
      }
    );

  const [isComposingReply, setIsComposingReply] = createSignal(true);

  return (
    <>
      <Record
        {...record()}
        config={{ navigateOnClick: false, navigateOnAuxClick: false }}
        class="!mt-0"
      />

      <div class="flex justify-between items-center h-12 n-space-y-1">
        <h2 class="text-2xl font-bold">Replies</h2>
        <Show when={actor() && !isComposingReply()}>
          <Button size="lg" onClick={() => setIsComposingReply(true)}>
            <Icon.signature.outline class="text-lg -ml-1" />
            Reply
          </Button>
        </Show>
      </div>

      <Show when={isComposingReply()}>
        <Composer
          parentRecordId={record().id}
          onSuccess={() => setIsComposingReply(false)}
        />
      </Show>

      <Show
        when={!(source().cursor === "" && infiniteReplies().length === 0)}
        fallback={
          // TODO: Different messages when author is viewing
          <ProfilePageEmptyMessage
            title={sample(NO_DATA_MESSAGES.title)}
            description={sample(NO_DATA_MESSAGES.description)}
          />
        }
      >
        <div class="grid gap-layout">
          <For each={infiniteReplies()}>
            {(record) => <Record {...(record as any)} />}
          </For>
        </div>

        <Show when={!end()} fallback={<RecordFeedEmptyMessage />}>
          <div ref={infiniteScrollLoader} class="py-8 h-full">
            <Icon.spinner class="text-2xl animate-spin mx-auto" />
          </div>
        </Show>
      </Show>
    </>
  );
}
