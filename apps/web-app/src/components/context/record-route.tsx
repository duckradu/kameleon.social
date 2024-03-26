import {
  Accessor,
  JSX,
  ParentProps,
  Show,
  Suspense,
  createContext,
  useContext,
} from "solid-js";

import { RouteDataType } from "~/routes/(platform)/a/[actorPublicId].r/[recordPublicId]";

export type IRecordRouteContext = {
  // * Force the type as `NonNullable` as the props.children are wrapped
  // * in <Suspense /> and <Show /> so nothing will be rendered unless
  // * props.recordAccessor is available
  record: Accessor<NonNullable<Awaited<ReturnType<RouteDataType>>["data"]>>;
};

const RecordRouteContext = createContext<IRecordRouteContext>();

export type RecordRouterProviderProps = ParentProps<{
  recordAccessor: Accessor<Awaited<ReturnType<RouteDataType>> | undefined>;

  fallback?: JSX.Element;
}>;

export function RecordRouteProvider(props: RecordRouterProviderProps) {
  return (
    <RecordRouteContext.Provider
      value={{ record: () => props.recordAccessor()?.data! }}
    >
      <Suspense fallback={props.fallback}>
        <Show when={props.recordAccessor()?.data}>{props.children}</Show>
      </Suspense>
    </RecordRouteContext.Provider>
  );
}

export function useRecordRoute() {
  const context = useContext(RecordRouteContext);

  if (context === undefined) {
    throw new Error(
      "`useRecordRoute` must be used within a RecordRouteProvider"
    );
  }

  return context;
}
