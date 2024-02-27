import { ParentProps, createContext, useContext } from "solid-js";

export const SessionContext = createContext();

// TODO: Type the value
export type SessionProviderProps = ParentProps<{
  sessionActor?: any | null;
}>;

export function SessionProvider(props: SessionProviderProps) {
  return (
    <SessionContext.Provider value={props.sessionActor}>
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
