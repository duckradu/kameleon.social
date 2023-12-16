import { Show } from "solid-js";
import { A } from "solid-start";

import {
  AuthNavigation,
  PrimaryNavigation,
} from "~/components/primary-navigation";
import { Icon } from "~/components/ui/icon";
import { Button } from "~/components/ui/button";

import { useSession } from "~/components/context/session";

import { voyage } from "~/lib/voyage-client";

export function Sidebar() {
  const sessionCtx = useSession();

  return (
    <div class="flex flex-col h-screen py-2">
      <A
        href="/"
        bg-sred
        class="flex justify-center items-center gap-3 px-3 pt-1 pb-2 w-13 h-13 transition-colors duration-100 hover:bg-muted rounded-full"
      >
        <Icon.logo.solid class="shrink-0 w-7 h-7" />

        {/* <span class="text-3xl font-logo -mb-3 hidden lg:inline">kameleon</span> */}
      </A>

      <div class="flex flex-col flex-grow justify-between gap-2">
        <PrimaryNavigation />

        <Show when={sessionCtx().session?.actor} fallback={<AuthNavigation />}>
          <Button
            class="w-13"
            onClick={async () => {
              sessionStorage.removeItem("accessToken");

              await voyage.auth.DELETE();
            }}
          >
            Exit
          </Button>
        </Show>
      </div>
    </div>
  );
}
