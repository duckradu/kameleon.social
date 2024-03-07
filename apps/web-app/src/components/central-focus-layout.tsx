import { ParentProps } from "solid-js";

import { PlatformFooter } from "~/components/platform-footer";
import { SquigglesBackground } from "~/components/squiggles-background";

export type CentralFocusLayoutProps = ParentProps;

export function CentralFocusLayout(props: CentralFocusLayoutProps) {
  return (
    <>
      <SquigglesBackground />

      <div class="flex flex-col h-screen p-4">
        <div class="flex items-center justify-center grow-1">
          {props.children}
        </div>

        <div class="max-w-sm mx-auto text-center">
          <PlatformFooter />
        </div>
      </div>
    </>
  );
}
