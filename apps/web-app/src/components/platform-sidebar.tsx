import { Show } from "solid-js";
import { A } from "@solidjs/router";

import { useSession } from "~/components/context/session";

import { Icon } from "~/components/ui/icon";
import {
  AuthNavigation,
  PrimaryNavigation,
} from "~/components/primary-navigation-items";
import { Button } from "~/components/ui/button";

import { signOut } from "~/server/modules/auth/actions";

export function PlatformSidebar() {
  const sessionActor = useSession();

  return (
    <div class="flex flex-col h-screen py-2">
      <A
        href="/"
        class="flex justify-center items-center gap-3 px-3 pt-1 pb-2 w-13 h-13 hover:bg-muted rounded-full transition-colors duration-100"
      >
        <Icon.logo.solid class="w-7 h-7 shrink-0" />
      </A>

      <div class="flex flex-col grow-1 justify-between gap-2">
        <PrimaryNavigation />

        <Show when={sessionActor} fallback={<AuthNavigation />}>
          <form action={signOut} method="post">
            <Button>Sign out</Button>
          </form>
        </Show>
      </div>
    </div>
  );
}
