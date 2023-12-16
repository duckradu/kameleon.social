import format from "date-fns/format";
import { A } from "solid-start";

export function Footer() {
  return (
    <div class="py-3 text-xs text-muted-foreground space-y-2">
      <nav class="flex flex-wrap gap-1 p-3 bg-muted rounded-md">
        <A href="/" class="hover:underline underline-offset-3">
          About us
        </A>
        &middot;
        <A href="/" class="hover:underline underline-offset-3">
          Terms & Privacy
        </A>
        &middot;
        <A href="/" class="hover:underline underline-offset-3">
          Help
        </A>
        &middot;
        <A href="/" class="hover:underline underline-offset-3">
          Send feedback
        </A>
      </nav>

      <p>© {format(new Date(), "yyyy")} kameleon.social</p>
      <small>v0.0.0</small>
    </div>
  );
}
