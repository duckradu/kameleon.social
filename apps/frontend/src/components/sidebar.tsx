import { A } from "solid-start";

import { Icon } from "~/components/ui/icon";

export function Sidebar() {
  return (
    <div class="flex flex-col h-screen py-3">
      <A href="/" class="flex items-center gap-2 px-2.5 pt-1 pb-2">
        <Icon.logo.solid class="shrink-0 w-7 h-7" />

        <div>
          <span class="text-xl font-bold">kameleon</span>
          <small class="text-muted-foreground">.social</small>
        </div>
      </A>

      <div class="flex flex-col flex-grow justify-between gap-2">
        <nav>navigation items</nav>

        <div>actor nav</div>
      </div>
    </div>
  );
}
