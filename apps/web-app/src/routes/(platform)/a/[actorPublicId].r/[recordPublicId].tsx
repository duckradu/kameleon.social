import {
  cache,
  createAsync,
  redirect,
  RouteSectionProps,
  useParams,
} from "@solidjs/router";
import {
  createEffect,
  createSignal,
  onCleanup,
  ParentProps,
  Show,
  Suspense,
} from "solid-js";

import { useActorRoute } from "~/components/context/actor-route";
import { RecordRouteProvider } from "~/components/context/record-route";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { paths } from "~/lib/constants/paths";
import { rpcSuccessResponse } from "~/lib/utils/rpc";
import { db } from "~/server/db";
import { actors, records } from "~/server/db/schemas";

const routeData = cache(
  async (
    actorId: NonNullable<(typeof actors.$inferInsert)["id"]>,
    recordPublicId: (typeof records.$inferSelect)["pid"]
  ) => {
    "use server";

    const matchingRecord = await db.query.records.findFirst({
      where: (records, { and, eq }) =>
        and(eq(records.authorId, actorId), eq(records.pid, recordPublicId)),
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
  "record:layout"
);

export type RouteDataType = typeof routeData;

export default function RecordLayoutWrapper(props: RouteSectionProps) {
  const params = useParams();

  return (
    <Show when={params.recordPublicId} keyed>
      <RecordLayout>{props.children}</RecordLayout>
    </Show>
  );
}

function RecordLayout(props: ParentProps) {
  const params = useParams();
  const { actor } = useActorRoute();

  const record = createAsync(() =>
    routeData(actor().id, params.recordPublicId)
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
    <RecordRouteProvider recordAccessor={record}>
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
            <div class="py-8 h-full">
              <Icon.spinner class="text-2xl animate-spin mx-auto" />
            </div>
          }
        >
          {props.children}
        </Suspense>
      </div>
    </RecordRouteProvider>
  );
}
