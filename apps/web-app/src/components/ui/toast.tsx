import { normalizeProps, useActor } from "@zag-js/solid";
import * as toast from "@zag-js/toast";
import { createMemo } from "solid-js";
import { tv } from "tailwind-variants";

import { ToastOptions, useToast } from "~/components/context/toast";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export const toastVariants = tv({
  base: [
    "relative pointer-events-auto overflow-hidden group",
    "border rounded-md",
    "flex items-center justify-between gap-2",
    "w-388px p-4 pr-6",
  ],
  variants: {
    variant: {
      default:
        "bg-background/10 backdrop-blur-xl text-foreground border-border hover:border-muted-foreground/50",
      destructive:
        "bg-destructive backdrop-blur-xl text-destructive-foreground border-destructive/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ToastProps = {
  actor: toast.Service<ToastOptions>;
};

export function Toast(props: ToastProps) {
  const [state, send] = useActor(props.actor);

  const api = createMemo(() => toast.connect(state, send, normalizeProps));
  const classes = createMemo(() =>
    toastVariants({
      variant: api().type === "error" ? "destructive" : "default",
    })
  );

  if (state.context.render) {
    return state.context.render(api);
  }

  return (
    <div class={classes()}>
      <div class="grid gap-1">
        <h3 {...api().titleProps} class="text-sm font-semibold">
          {api().title}
        </h3>
        <p {...api().descriptionProps} class="text-xs opacity-90">
          {api().description}
        </p>
      </div>
      <Button
        size="xs"
        shape="squircle"
        variant="ghost"
        onClick={api().dismiss}
        class="text-base rounded-sm absolute top-1 right-1 transition-opacity opacity-0 focus:opacity-100 group-hover:opacity-100"
      >
        <Icon.x />
      </Button>
    </div>
  );
}

export function TriggerToast(props: Partial<toast.ToastOptions<ToastOptions>>) {
  const toast = useToast();

  toast().create(props);

  return null;
}
