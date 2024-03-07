import { Navigate, RouteSectionProps } from "@solidjs/router";

import { CentralFocusLayout } from "~/components/central-focus-layout";
import { useSession } from "~/components/context/session";

export default function AuthLayout(props: RouteSectionProps) {
  const { actor } = useSession();

  if (actor()) {
    return <Navigate href="/" />;
  }

  return (
    <CentralFocusLayout>
      <main class="max-w-sm w-full space-y-6">{props.children}</main>
    </CentralFocusLayout>
  );
}
