import { RouteSectionProps } from "@solidjs/router";

import { PlatformFooter } from "~/components/platform-footer";
import { PlatformSidebar } from "~/components/platform-sidebar";

export default function PlatformLayout(props: RouteSectionProps) {
  return (
    <div class="flex [&>:first-child]:ml-auto [&>:last-child]:mr-auto [&>aside]:px-3 [&>div>main]:px-3x">
      <aside class="relative w-64 shrink-0 z-10">
        <div class="sticky top-0 w-full h-screen">
          <PlatformSidebar />
        </div>
      </aside>

      {/* Alternate between w-2xl and w-full */}
      <div class="w-full">
        <main class="w-full max-w-2xl min-h-screen mx-auto [&>*:first-child:not(.no-layout-p)]:py-3">
          {props.children}
        </main>
      </div>

      <aside class="relative w-74 shrink-0 z-10">
        <div class="sticky top-0 w-full h-screen">
          <div class="py-3">
            <PlatformFooter />
          </div>
        </div>
      </aside>
    </div>
  );
}
