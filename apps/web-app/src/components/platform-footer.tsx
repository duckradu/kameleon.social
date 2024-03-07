import { A } from "@solidjs/router";
import { format } from "date-fns/format";

import { paths } from "~/lib/constants/paths";

export function PlatformFooter() {
  // TODO: Probably move the paths to constants. Or use .env for actor id
  return (
    <footer class="text-xs text-muted-foreground space-y-2">
      <nav class="flex flex-wrap gap-1 p-3 bg-muted rounded-md">
        <A
          href={paths.actor("first_kameleon").record("about-us")}
          class="hover:underline underline-offset-3"
        >
          About us
        </A>
        &middot;
        <A
          href={paths.actor("first_kameleon").record("terms-and-privacy")}
          class="hover:underline underline-offset-3"
        >
          Terms & Privacy
        </A>
        &middot;
        <A
          href={paths.actor("first_kameleon").record("help")}
          class="hover:underline underline-offset-3"
        >
          Help
        </A>
        &middot;
        <A
          href={paths.actor("first_kameleon").record("send-feedback")}
          class="hover:underline underline-offset-3"
        >
          Send feedback
        </A>
      </nav>

      <p>© {format(new Date(), "yyyy")} kameleon.social</p>
      <small>v0.0.0</small>
    </footer>
  );
}
