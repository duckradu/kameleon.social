import { RouteSectionProps } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";

import { SessionProvider } from "~/components/context/session";

import { Footer } from "~/components/footer";
import { PlatformSidebar } from "~/components/platform-sidebar";

export default function PlatformLayout(props: RouteSectionProps) {
  const event = getRequestEvent();

  return (
    <SessionProvider sessionActor={event?.locals.sessionActor || null}>
      <div class="flex [&>:first-child]:ml-auto [&>:last-child]:mr-auto [&>aside]:px-2 [&>div>main]:px-2">
        <aside class="relative w-64 shrink-0 z-20">
          <div class="sticky top-0 w-full h-screen">
            <PlatformSidebar />
          </div>
        </aside>

        <div class="w-full">
          <main class="relative w-full max-w-2xl min-h-screen mx-auto">
            {props.children}
          </main>
        </div>

        <aside class="relative w-74 shrink-0 z-10">
          <div class="sticky top-0 w-full h-screen">
            <div class="py-2">
              <Footer />
            </div>
          </div>
        </aside>
      </div>
    </SessionProvider>
  );
}
