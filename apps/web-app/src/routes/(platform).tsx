import { RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js";

import { useSession } from "~/components/context/session";
import { PlatformFooter } from "~/components/platform-footer";
import { PlatformSidebar } from "~/components/platform-sidebar";
import { ShowCreateNewRecordDialogButton } from "~/components/show-create-new-record-dialog-button";
import { tunnel } from "~/components/tunnel";

const secondaryColumnTunnel = tunnel();

export default function PlatformLayout(props: RouteSectionProps) {
  const { actor } = useSession();

  return (
    <div class="flex [&>:first-child]:ml-auto [&>:last-child]:mr-auto [&>aside]:px-layout [&>div>main]:px-layoutx">
      <aside class="relative w-64 shrink-0 z-10">
        <div class="sticky top-0 w-full h-screen">
          <PlatformSidebar />
        </div>
      </aside>

      {/* Alternate between w-2xl and w-full */}
      <div class="w-full">
        <main class="w-full max-w-2xl min-h-screen mx-auto">
          {props.children}
        </main>
      </div>

      <aside class="relative w-74 shrink-0 z-10">
        <div class="sticky top-0 w-full h-screen">
          <div class="flex flex-col h-screen py-layout">
            <div class="flex grow-1">
              <secondaryColumnTunnel.Out fallback={<PlatformFooter />} />
            </div>

            <Show when={actor()}>
              <ShowCreateNewRecordDialogButton
                buttonProps={{
                  size: "xl",
                  class: "self-end [&>svg]-(text-xl -mx-1)",
                }}
              />
            </Show>
          </div>
        </div>
      </aside>
    </div>
  );
}
