import {
  RouteDefinition,
  cache,
  createAsync,
  redirect,
  useLocation,
  useParams,
} from "@solidjs/router";
import { eq } from "drizzle-orm";
import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";

import { Composer } from "~/components/composer/composer";
import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { Record } from "~/components/record";
import { RecordFeedEmptyMessage } from "~/components/record-feed-empty-message";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { db } from "~/server/db";
import { recordVersions, records } from "~/server/db/schemas";
import { findOneByPID$ } from "~/server/modules/actors/rpc";
import { getRecordsPage$ } from "~/server/modules/records/rpc";

import { createInfiniteScroll } from "~/lib/primitives/create-infinite-scroll";

import { sample } from "~/lib/utils/common";
import { rpcSuccessResponse } from "~/lib/utils/rpc";

import { paths } from "~/lib/constants/paths";
import { createRouteInfiniteScroll } from "~/lib/primitives/create-route-infinite-scroll";

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

const getRecord = cache(
  async (actorPublicId: string, recordPublicId: string) => {
    "use server";

    const matchingActor = await findOneByPID$(actorPublicId);

    if (!matchingActor) {
      throw redirect(paths.notFound);
    }

    const matchingRecord = await db.query.records.findFirst({
      where: (records, { and, eq }) =>
        and(
          eq(records.authorId, matchingActor.id),
          eq(records.pid, recordPublicId)
        ),
      with: {
        author: true,
        versions: {
          orderBy: (recordVersions, { desc }) => [
            desc(recordVersions.createdAt),
          ],
          limit: 1,
        },
      },
    });

    if (!matchingRecord) {
      throw redirect(paths.notFound);
    }

    const { versions, ...record } = matchingRecord;

    return rpcSuccessResponse({
      ...record,
      latestVersion: versions[0],
    });
  },
  "record"
);

const getRecordReplies = cache(
  async (actorPublicId: string, recordPublicId: string, cursor?: string) => {
    "use server";

    const matchingActor = await findOneByPID$(actorPublicId);

    if (!matchingActor) {
      return rpcSuccessResponse([]);
    }

    const matchingRecord = await db.query.records.findFirst({
      where: (records, { and, eq }) =>
        and(
          eq(records.authorId, matchingActor.id),
          eq(records.pid, recordPublicId)
        ),
    });

    if (!matchingRecord) {
      return rpcSuccessResponse([]);
    }

    const matchingReplies = await getRecordsPage$(
      eq(records.parentRecordId, matchingRecord.id),
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

export const route = {
  load: ({ params }) => getRecord(params.actorPublicId, params.recordPublicId),
} satisfies RouteDefinition;

export default function RecordReplies() {
  const params = useParams();
  const { actor } = useSession();

  const record = createAsync(() =>
    getRecord(params.actorPublicId, params.recordPublicId)
  );
  const [infiniteReplies, infiniteScrollLoader, { source, end }] =
    createRouteInfiniteScroll<
      NonNullable<Awaited<ReturnType<typeof getRecordReplies>>["data"]>[number],
      { actorPublicId: string; recordPublicId: string; cursor: string }
    >(
      async (source) => {
        const response = await getRecordReplies(
          source.actorPublicId,
          source.recordPublicId,
          source.cursor
        );

        if (response.success) {
          return response.data;
        }

        return [];
      },
      (infiniteReplies, paramsArg) => ({
        actorPublicId: paramsArg?.actorPublicId || "",
        recordPublicId: paramsArg?.recordPublicId || "",
        cursor: infiniteReplies?.()?.at(-1)?.createdAt || "",
      }),
      params
    );

  const [isComposingReply, setIsComposingReply] = createSignal(false);

  return (
    <>
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
          parentRecordId={record()!.data!.id}
          onSuccess={() => setIsComposingReply(false)}
        />
      </Show>

      <Show
        when={!(source()?.cursor === "" && infiniteReplies().length === 0)}
        fallback={
          // TODO: Different messages when author is viewing
          <ProfilePageEmptyMessage
            title={sample(NO_DATA_MESSAGES.title)}
            description={sample(NO_DATA_MESSAGES.description)}
          />
        }
      >
        <div class="grid gap-layout py-layout !!!!!!!!!!!!!!!!!">
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
