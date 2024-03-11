import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useSession } from "~/components/context/session";

import { ActorNavigationMenu } from "~/components/actor-navigation-menu";
import {
  AuthNavigation,
  PrimaryNavigation,
} from "~/components/primary-navigation-items";
import { Icon } from "~/components/ui/icon";

export function PlatformSidebar() {
  const { actor } = useSession();

  return (
    <div class="flex flex-col h-screen py-3">
      <A
        href="/"
        class="flex justify-center items-center gap-3 px-3 pt-1 pb-2 w-13 h-13 hover:bg-muted rounded-full"
      >
        <Icon.logo.solid class="w-7 h-7 shrink-0" />
      </A>

      <div class="flex flex-col grow-1 justify-between gap-2">
        <PrimaryNavigation />

        <Show when={actor()} fallback={<AuthNavigation />}>
          <ActorNavigationMenu />
        </Show>
      </div>
    </div>
  );
}
