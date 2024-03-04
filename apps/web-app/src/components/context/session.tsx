import {
  Accessor,
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";

// TODO: Clean the types :D
export const SessionContext = createContext<{
  sessionActor: Accessor<SessionProviderProps["sessionActor"]>;
}>();

// TODO: Type the value
export type SessionProviderProps = ParentProps<{
  sessionActor: any | undefined;
}>;

export function SessionProvider(props: SessionProviderProps) {
  const [sessionActor, setSessionActor] = createSignal<
    SessionProviderProps["sessionActor"]
  >(props.sessionActor);

  createEffect(() => {
    setSessionActor(props.sessionActor);
  });

  return (
    <SessionContext.Provider value={{ sessionActor }}>
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
