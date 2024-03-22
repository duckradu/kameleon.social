import * as dialog from "@zag-js/dialog";
import { normalizeProps, useMachine } from "@zag-js/solid";
import {
  JSX,
  Show,
  createMemo,
  createUniqueId,
  mergeProps,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { VariantProps, tv } from "tailwind-variants";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export const dialogVariants = tv({
  slots: {
    backdrop: "fixed bg-background bg-opacity-80 backdrop-blur-sm z-50 inset-0",
    content:
      "relative flex flex-col gap-3 p-5 bg-background border border-border rounded-xl w-full", // SIZES
  },
  variants: {
    size: {
      default: { content: "max-w-md" },
      lg: { content: "max-w-lg" },
      xl: { content: "max-w-xl" },
      "2xl": { content: "max-w-2xl" },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface DialogProps
  extends Pick<
      dialog.Context,
      | "role"
      | "preventScroll"
      | "initialFocusEl"
      | "onInteractOutside"
      | "closeOnInteractOutside"
      | "onEscapeKeyDown"
      | "closeOnEscapeKeyDown"
    >,
    VariantSlotsClassProps<typeof dialogVariants>,
    VariantProps<typeof dialogVariants> {
  trigger: (triggerProps: dialog.Api["triggerProps"]) => JSX.Element;

  title?: JSX.Element;
  description?: JSX.Element;

  children?: (dialogApi: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  }) => JSX.Element;

  footer?: JSX.Element;
}

export function Dialog(originalProps: DialogProps) {
  const propsWithDefaults = mergeProps(
    {
      role: "dialog" as dialog.Context["role"],
      preventScroll: true,
      closeOnInteractOutside: true,
      closeOnEscapeKeyDown: true,
    },
    originalProps
  );
  const [slotsClassProps, dialogProps, props] = splitProps(
    propsWithDefaults,
    ["backdropClass", "contentClass"],
    ["trigger", "title", "description", "children", "footer"]
  );

  const [state, send] = useMachine(
    dialog.machine({
      id: createUniqueId(),

      role: props.role,
      preventScroll: props.preventScroll,

      initialFocusEl: props.initialFocusEl,

      onInteractOutside: props.onInteractOutside,
      closeOnInteractOutside: props.closeOnInteractOutside,

      onEscapeKeyDown: props.onEscapeKeyDown,
      closeOnEscapeKeyDown: props.closeOnEscapeKeyDown,
    })
  );

  const api = createMemo(() => dialog.connect(state, send, normalizeProps));
  const classes = createMemo(() => dialogVariants(props));

  return (
    <>
      {dialogProps.trigger(api().triggerProps)}
      <Show when={api().isOpen}>
        <Portal>
          <div
            {...api().backdropProps}
            class={classes().backdrop({ class: slotsClassProps.backdropClass })}
          />
          <div
            {...api().positionerProps}
            class="fixed w-screen h-screen flex justify-center items-center z-50 inset-0"
          >
            <div
              {...api().contentProps}
              class={classes().content({ class: slotsClassProps.contentClass })}
            >
              <Button
                size="sm"
                variant="ghost"
                {...api().closeTriggerProps}
                class="text-base absolute top-2 right-2 z-50"
                iconOnly
              >
                <Icon.x />
              </Button>

              <Show when={dialogProps.title || dialogProps.description}>
                <div class="flex flex-col gap-2 text-left">
                  <Show when={dialogProps.title}>
                    <h2
                      {...api().titleProps}
                      class="text-lg font-semibold leading-none tracking-tight"
                    >
                      {dialogProps.title}
                    </h2>
                  </Show>
                  <Show when={dialogProps.description}>
                    <p
                      {...api().descriptionProps}
                      class="text-sm text-muted-foreground"
                    >
                      {dialogProps.description}
                    </p>
                  </Show>
                </div>
              </Show>

              {dialogProps.children?.({
                isOpen: api().isOpen,
                open: api().open,
                close: api().close,
              })}

              <Show when={typeof dialogProps.footer !== "undefined"}>
                <div class="flex flex-row justify-end gap-2">
                  {dialogProps.footer}
                </div>
              </Show>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
