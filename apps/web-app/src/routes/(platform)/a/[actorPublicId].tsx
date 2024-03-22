import {
  A,
  RouteDefinition,
  RouteSectionProps,
  cache,
  createAsync,
  useParams,
} from "@solidjs/router";
import { format } from "date-fns/format";
import { Show, Suspense } from "solid-js";

import { useSession } from "~/components/context/session";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import { findOneByPID$ } from "~/server/modules/actors/rpc";

import { getShortName } from "~/lib/utils/actors";
import { stripURL } from "~/lib/utils/common";

import { paths } from "~/lib/constants/paths";

const routeData = cache(findOneByPID$, "view-actor");

export const route = {
  load: ({ params }) => routeData(params.actorPublicId),
} satisfies RouteDefinition;

export default function ActorLayout(props: RouteSectionProps) {
  const params = useParams();
  const { actor: sessionActor } = useSession();

  const actor = createAsync(() => routeData(params.actorPublicId));

  return (
    <div class="space-y-layout">
      {/* <div class="w-screen h-screen absolute w-full left-0 right-0 -z-1 bg-foreground/10" /> */}

      <header class="space-y-2">
        <div>
          <div class="h-[200px] bg-muted rounded-b-xl" />

          <div class="relative grid grid-cols-3">
            <div />

            <div class="flex flex-col items-center justify-center space-y-2">
              <Avatar
                size="profile"
                fallback={getShortName(actor()?.name || "")}
                rootClass="-mt-12 border-3 border-background"
              />

              <div class="text-center">
                <h1 class="text-xl font-semibold">{actor()?.name}</h1>
                <A
                  href={paths.actor(actor()?.pid || "").profile}
                  class="text-muted-foreground text-sm hover:underline underline-offset-3"
                >
                  @{actor()?.pid}
                </A>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <Show when={sessionActor() && sessionActor()!.id !== actor()?.id}>
                <Button>Follow</Button>
              </Show>
            </div>
          </div>
        </div>

        <Show when={actor()?.note}>
          <p class="text-center">{actor()!.note}</p>
        </Show>

        <div class="flex py-1 justify-evenly text-sm [&>span>svg]-(inline-flex mr-1)">
          <span>
            <Icon.map.pin.outline />
            London
          </span>
          <Show when={actor()?.externalUrl}>
            <span>
              <Icon.link.minimalistic.outline />
              <A
                href={actor()!.externalUrl!}
                target="_blank"
                class="text-brand underline underline-offset-3 hover:no-underline"
              >
                {stripURL(actor()!.externalUrl!)}
              </A>
            </span>
          </Show>
          <Show when={actor()?.createdAt}>
            <span>
              <Icon.calendar.outline />
              Joined {format(new Date(actor()!.createdAt), "MMM yyyy")}
            </span>
          </Show>
          <Show when={actor()?.createdAt}>
            <span>
              <Icon.cake.outline />
              Cake day {format(new Date(actor()!.createdAt), "MMM yyyy")}
            </span>
          </Show>
        </div>
      </header>

      <div class="relative">
        <div class="sticky-header flex z-10 [&>a]-(flex flex-1 items-center justify-center py-3 font-medium border-b border-brand) [&>a:hover]:bg-muted-foreground/10 [&>a:not(.active)]-(text-muted-foreground border-muted)">
          <A href={paths.actor(actor()?.pid || "").profile} end>
            Activity
          </A>
          <A href={paths.actor(actor()?.pid || "").moments}>Moments</A>
          <A href={paths.actor(actor()?.pid || "").connections}>Connections</A>
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
    </div>
  );
}
