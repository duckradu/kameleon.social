import { RouteSectionProps } from "@solidjs/router";

import { ActorRouteProvider } from "~/components/context/actor-route";

export default function ALayout(props: RouteSectionProps) {
  return <ActorRouteProvider>{props.children}</ActorRouteProvider>;
}
