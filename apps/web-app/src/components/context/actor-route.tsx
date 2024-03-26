import {
  Accessor,
  ParentProps,
  Show,
  Suspense,
  createContext,
  useContext,
} from "solid-js";

import { RouteDataType } from "~/routes/(platform)/a";

export type IActorRouteContext = {
  // * Force the type as `NonNullable` as the props.children are wrapped
  // * in <Suspense /> and <Show /> so nothing will be rendered unless
  // * props.actorAccessor is available
  actor: Accessor<NonNullable<Awaited<ReturnType<RouteDataType>>["data"]>>;
};

const ActorRouteContext = createContext<IActorRouteContext>();

export type ActorRouteProviderProps = ParentProps<{
  actorAccessor: Accessor<Awaited<ReturnType<RouteDataType>> | undefined>;
}>;

export function ActorRouteProvider(props: ActorRouteProviderProps) {
  return (
    <ActorRouteContext.Provider
      value={{ actor: () => props.actorAccessor()?.data! }}
    >
      <Suspense>
        <Show when={props.actorAccessor()?.data}>{props.children}</Show>
      </Suspense>
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
