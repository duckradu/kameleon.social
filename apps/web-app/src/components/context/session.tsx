import { createAsync } from "@solidjs/router";
import {
  Accessor,
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";

import { actors } from "~/server/db/schemas/actors";

import { getSessionActor } from "~/server/modules/auth/actions";

export type ISessionContext = {
  actor: Accessor<typeof actors.$inferSelect | null>;
};

const SessionContext = createContext<ISessionContext>();

export function SessionProvider(props: ParentProps) {
  const sessionActor = createAsync(() => getSessionActor());

  const [actor, setActor] = createSignal<typeof actors.$inferSelect | null>(
    sessionActor()?.data || null
  );

  createEffect(() => {
    setActor(sessionActor()?.data || null);
  });

  return (
    <SessionContext.Provider value={{ actor }}>
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
