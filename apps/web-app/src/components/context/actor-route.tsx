import { cache, createAsync, redirect, useParams } from "@solidjs/router";
import { Accessor, ParentProps, createContext, useContext } from "solid-js";

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
}, "actor:route");

export type IActorRouteContext = {
  actor: Accessor<Awaited<ReturnType<typeof routeData>> | undefined>;
};

const ActorRouteContext = createContext<IActorRouteContext>();

export function ActorRouteProvider(props: ParentProps) {
  const params = useParams();

  const actor = createAsync(() => routeData(params.actorPublicId));

  return (
    <ActorRouteContext.Provider value={{ actor }}>
      {props.children}
    </ActorRouteContext.Provider>
  );
}

export function useActorRoute() {
  const context = useContext(ActorRouteContext);

  if (context === undefined) {
    throw new Error("`useActorRoute` must be used within a ActorRouteProvider");
  }

  return context;
}
