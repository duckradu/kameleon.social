import { cache, createAsync } from "@solidjs/router";
import { Accessor, ParentProps, createContext, useContext } from "solid-js";

import { actors } from "~/server/db/schemas/actors";

import { getSessionActor$ } from "~/server/modules/auth/rpc";

const routeData = cache(getSessionActor$, "session");

export type ISessionContext = {
  actor: Accessor<typeof actors.$inferSelect | undefined>;
};

const SessionContext = createContext<ISessionContext>();

export function SessionProvider(props: ParentProps) {
  const sessionActor = createAsync(() => routeData());

  return (
    <SessionContext.Provider value={{ actor: () => sessionActor()?.data }}>
      {props.children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("`useSession` must be used within a SessionProvider");
  }

  return context;
}
