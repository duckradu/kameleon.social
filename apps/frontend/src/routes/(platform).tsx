import { Outlet } from "solid-start";

import { Footer } from "~/components/footer";
import { Sidebar } from "~/components/sidebar";

export default function PlatformLayout() {
  return (
    <div class="flex [&>:first-child]:ml-auto [&>:last-child]:mr-auto [&>aside]:px-3 [&>div>main]:px-3">
      <aside class="relative w-64 shrink-0 z-20">
        <div class="sticky top-0 w-full h-screen">
          <Sidebar />
        </div>
      </aside>

      <div class="w-full">
        <main class="relative w-full max-w-xl min-h-screen mx-auto border-x">
          <Outlet />
        </main>
      </div>

      <aside class="relative w-74 shrink-0 z-10">
        <div class="sticky top-0 w-full h-screen">
          <Footer />
        </div>
      </aside>
    </div>
  );
}
