import {
  RouteDefinition,
  RouteSectionProps,
  createAsync,
} from "@solidjs/router";

import { SessionProvider } from "~/components/context/session";

import { Footer } from "~/components/footer";
import { PlatformSidebar } from "~/components/platform-sidebar";

import { getSessionActor } from "~/server/modules/auth/actions";

export const route = {
  load: () => getSessionActor(),
} satisfies RouteDefinition;

export default function PlatformLayout(props: RouteSectionProps) {
  const sessionActor = createAsync(() => getSessionActor());

  return (
    <SessionProvider sessionActor={sessionActor()?.data}>
      <div class="flex [&>:first-child]:ml-auto [&>:last-child]:mr-auto [&>aside]:px-2 [&>div>main]:px-2xxx">
        <aside class="relative w-64 shrink-0 z-10">
          <div class="sticky top-0 w-full h-screen">
            <PlatformSidebar />
          </div>
        </aside>

        {/* TODO: Replace to w-full */}
        <div class="w-2xl">
          <main class="w-full max-w-2xl min-h-screen mx-auto">
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
