import { RouteSectionProps } from "@solidjs/router";

import { CentralFocusLayout } from "~/components/central-focus-layout";

// TODO: Redirect away if already logged in
export default function AuthLayout(props: RouteSectionProps) {
  return (
    <CentralFocusLayout>
      <main class="max-w-sm w-full space-y-6">{props.children}</main>
    </CentralFocusLayout>
  );
}
