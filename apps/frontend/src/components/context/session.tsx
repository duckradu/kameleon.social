import {
  Accessor,
  ParentProps,
  createContext,
  createMemo,
  onMount,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

import { voyage } from "~/lib/voyage-client";

type Session = {
  actor: Awaited<ReturnType<typeof voyage.auth.GET>>;
};

type SessionContext = {
  session: Session | null;
};

const sessionContext = createContext<Accessor<SessionContext>>();

export function SessionProvider(props: ParentProps) {
  const [session, setSession] = createStore<{
    actor: Awaited<ReturnType<typeof voyage.auth.GET>> | null;
  }>({ actor: null });

  onMount(async () => {
    let actor = await getSessionActor();

    if (!actor) {
      const response = await voyage.auth.refresh.POST();

      if (response.accessToken) {
        sessionStorage.setItem("accessToken", response.accessToken);
      }

      actor = await getSessionActor();
    }

    if (actor) {
      setSession({ actor });
    }
  });

  const providerValue = createMemo(() => ({
    session: session.actor ? (session as Session) : null,
  }));

  return (
    <sessionContext.Provider value={providerValue}>
      {props.children}
    </sessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(sessionContext);

  if (!context) {
    throw new Error("`useSession` must be used within a `SessionProvider`");
  }

  return context;
}

async function getSessionActor() {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    return await voyage.auth.GET();
  }
}
