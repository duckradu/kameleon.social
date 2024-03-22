import {
  RouteDefinition,
  cache,
  createAsync,
  redirect,
  useParams,
} from "@solidjs/router";
import { Show, Suspense, createSignal } from "solid-js";

import { Composer } from "~/components/composer/composer";
import { useSession } from "~/components/context/session";
import { ProfilePageEmptyMessage } from "~/components/profile-page-empty-message";
import { RecordFeed } from "~/components/record-feed";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { db } from "~/server/db";
import { actors, recordVersions, records } from "~/server/db/schemas";
import { findOneByPID$ } from "~/server/modules/actors/rpc";

import { sample } from "~/lib/utils/common";
import { rpcSuccessResponse } from "~/lib/utils/rpc";

import { paths } from "~/lib/constants/paths";

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

const getRouteData = cache(
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

    const matchingReplies = await db.query.records.findMany({
      where: (records, { eq }) => eq(records.parentRecordId, matchingRecord.id),
      with: {
        author: true,
        versions: {
          orderBy: (recordVersions, { desc }) => [
            desc(recordVersions.createdAt),
          ],
          limit: 1,
        },
      },
      orderBy: (records, { desc }) => [desc(records.createdAt)],
    });

    const { versions, ...record } = matchingRecord;

    return rpcSuccessResponse({
      record: {
        ...record,
        latestVersion: versions[0],
      },
      replies:
        matchingReplies.reduce(
          (acc, { versions, ...curr }) => [
            ...acc,
            { ...curr, latestVersion: versions[0] },
          ],
          [] as (typeof records.$inferSelect & {
            latestVersion: typeof recordVersions.$inferSelect;
          })[]
        ) || [],
    });
  },
  "record:replies"
);

export const route = {
  load: ({ params }) =>
    getRouteData(params.actorPublicId, params.recordPublicId),
} satisfies RouteDefinition;

export default function RecordReplies() {
  const params = useParams();
  const { actor } = useSession();

  const routeData = createAsync(() =>
    getRouteData(params.actorPublicId, params.recordPublicId)
  );

  const [isComposingReply, setIsComposingReply] = createSignal(false);

  return (
    <>
      <div class="flex justify-between items-center no-space-layout -my-1">
        <h2 class="text-2xl font-bold py-2">Replies</h2>
        <Show when={actor() && !isComposingReply()}>
          <Button size="lg" onClick={() => setIsComposingReply(true)}>
            <Icon.signature.outline class="text-lg -ml-1" />
            Reply
          </Button>
        </Show>
      </div>

      <Show when={isComposingReply()}>
        <Composer
          parentRecordId={routeData()!.data!.record.id}
          onSuccess={() => setIsComposingReply(false)}
        />
      </Show>

      <Suspense
        fallback={
          <div class="py-8 h-full">
            <Icon.spinner class="text-2xl animate-spin mx-auto" />
          </div>
        }
      >
        <Show
          when={routeData()?.data?.replies.length}
          fallback={
            <ProfilePageEmptyMessage
              title={sample(NO_DATA_MESSAGES.title)}
              description={sample(NO_DATA_MESSAGES.description)}
            />
          }
        >
          <RecordFeed
            recordList={
              routeData()!.data!.replies as (typeof records.$inferSelect & {
                author: typeof actors.$inferSelect;
                latestVersion: typeof recordVersions.$inferSelect;
              })[]
            }
          />
        </Show>
      </Suspense>
    </>
  );
}
