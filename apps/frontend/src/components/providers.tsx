import { ParentProps } from "solid-js";

import { SessionProvider } from "~/components/context/session";

export function Providers(props: ParentProps) {
  return <SessionProvider>{props.children}</SessionProvider>;
}
