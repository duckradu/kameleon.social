import { A } from "solid-start";

import {
  AuthNavigation,
  PrimaryNavigation,
} from "~/components/primary-navigation";
import { Icon } from "~/components/ui/icon";

export function Sidebar() {
  return (
    <div class="flex flex-col h-screen py-2">
      <A
        href="/"
        class="flex justify-center items-center gap-3 px-3 pt-1 pb-2 w-13 h-13 hover:bg-muted rounded-full"
      >
        <Icon.logo.solid class="shrink-0 w-7 h-7" />

        {/* <span class="text-3xl font-logo -mb-3 hidden lg:inline">kameleon</span> */}
      </A>

      <div class="flex flex-col flex-grow justify-between gap-2">
        <PrimaryNavigation />

        <AuthNavigation />
      </div>
    </div>
  );
}
