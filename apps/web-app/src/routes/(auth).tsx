import { RouteSectionProps } from "@solidjs/router";

import { Footer } from "~/components/footer";
import { SquigglesBackground } from "~/components/squiggles-background";

export default function AuthLayout(props: RouteSectionProps) {
  return (
    <>
      <SquigglesBackground />

      <div class="flex flex-col h-screen p-4">
        <div class="flex items-center justify-center flex-grow">
          {props.children}
        </div>

        <div class="max-w-sm text-center mx-auto">
          <Footer />
        </div>
      </div>
    </>
  );
}
