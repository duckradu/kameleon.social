import { Outlet } from "solid-start";

import { Footer } from "~/components/footer";

export default function AuthLayout() {
  return (
    <div class="h-[100dvh] flex flex-col">
      <img
        src="/assets/squiggle-1.svg"
        class="fixed -top-2 -left-2 w-[calc(20vh)] -z-1"
      />
      <img
        src="/assets/squiggle-2.svg"
        class="fixed top-1/8 -right-2 w-[6.5vh] -z-1"
      />
      <img
        src="/assets/squiggle-3.svg"
        class="fixed top-1/2 -left-2 w-[13vh] -z-1"
      />
      <div class="flex items-center justify-center p-4 flex-grow">
        <Outlet />
      </div>

      <div class="max-w-sm text-center mx-auto">
        <Footer />
      </div>
    </div>
  );
}
