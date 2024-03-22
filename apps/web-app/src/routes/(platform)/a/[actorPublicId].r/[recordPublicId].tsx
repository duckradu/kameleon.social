import {
  cache,
  createAsync,
  redirect,
  RouteDefinition,
  RouteSectionProps,
  useParams,
} from "@solidjs/router";
import {
  createEffect,
  createSignal,
  onCleanup,
  Show,
  Suspense,
} from "solid-js";

import { Record as RecordComponent } from "~/components/record";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { db } from "~/server/db";
import { findOneByPID$ } from "~/server/modules/actors/rpc";

import { rpcSuccessResponse } from "~/lib/utils/rpc";

import { paths } from "~/lib/constants/paths";

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
        // TODO: Add parentRecord here
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

export const route = {
  load: ({ params }) =>
    getRouteData(params.actorPublicId, params.recordPublicId),
} satisfies RouteDefinition;

export default function Record(props: RouteSectionProps) {
  const params = useParams();

  const routeData = createAsync(() =>
    getRouteData(params.actorPublicId, params.recordPublicId)
  );

  const [noScrollY, setNoScrollY] = createSignal(true);

  createEffect(() => {
    const event = "scroll";
    const callback = () => {
      if (window.scrollY === 0 && noScrollY() === false) {
        setNoScrollY(true);
      }
      if (window.scrollY !== 0 && noScrollY() === true) {
        setNoScrollY(false);
      }
    };

    window.addEventListener(event, callback);

    onCleanup(() => window.removeEventListener(event, callback));
  });

  return (
    <div class="relative space-y-layout">
      <div
        classList={{
          "sticky-header py-layout z-10 border-b": true,

          "border-transparent": noScrollY(),
          "border-border": !noScrollY(),
        }}
      >
        <Button variant="secondary" onClick={() => history.back()}>
          <Icon.arrow.left class="text-base" />
          Back
        </Button>
      </div>

      <Suspense
        fallback={
          <div class="!mt-0 py-8 h-full border border-border rounded-xl">
            <Icon.spinner class="text-2xl animate-spin mx-auto" />
          </div>
        }
      >
        <Show when={routeData()?.data}>
          <RecordComponent
            {...routeData()!.data!}
            config={{ navigateOnClick: false, navigateOnAuxClick: false }}
            class="!mt-0"
          />
        </Show>
      </Suspense>

      <Suspense
        fallback={
          <div class="py-8 h-full">
            <Icon.spinner class="text-2xl animate-spin mx-auto" />
          </div>
        }
      >
        {props.children}
      </Suspense>
    </div>
  );
}
