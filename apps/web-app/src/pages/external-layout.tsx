import { RouteSectionProps } from "@solidjs/router";

import { CentralFocusLayout } from "~/components/central-focus-layout";

export default function ExternalLayout(props: RouteSectionProps) {
  return (
    <CentralFocusLayout>
      <main class="max-w-sm w-full space-y-6">{props.children}</main>
    </CentralFocusLayout>
  );
}
