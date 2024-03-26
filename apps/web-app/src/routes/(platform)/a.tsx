import {
  RouteSectionProps,
  cache,
  createAsync,
  redirect,
  useParams,
} from "@solidjs/router";
import { ParentProps, Show } from "solid-js";

import { ActorRouteProvider } from "~/components/context/actor-route";
import { Icon } from "~/components/ui/icon";

import { findOneByPID$ } from "~/server/modules/actors/rpc";

import { rpcSuccessResponse } from "~/lib/utils/rpc";

import { paths } from "~/lib/constants/paths";

const routeData = cache(async (actorPublicId: string) => {
  "use server";

  const matchingActor = await findOneByPID$(actorPublicId);

  if (!matchingActor) {
    throw redirect(paths.notFound);
  }

  return rpcSuccessResponse(matchingActor);
}, "actor:layout");

export type RouteDataType = typeof routeData;

export default function ALayoutWrapper(props: RouteSectionProps) {
  const params = useParams();

  return (
    <Show when={params.actorPublicId} keyed>
      <ALayout>{props.children}</ALayout>
    </Show>
  );
}

function ALayout(props: ParentProps) {
  const params = useParams();

  const actor = createAsync(() => routeData(params.actorPublicId));

  return (
    <ActorRouteProvider
      actorAccessor={actor}
      fallback={
        <div class="py-8">
          <Icon.spinner class="text-2xl animate-spin mx-auto" />
        </div>
      }
    >
      {props.children}
    </ActorRouteProvider>
  );
}
