import { createMemo, JSX } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";

import { Icon } from "~/components/ui/icon";

export const fieldErrorVariants = tv({
  slots: {
    root: ["flex items-center gap-1", "text-xs text-red-600", "px-1"],
    icon: "w-4 h-4",
  },
});

export interface FieldErrorProps
  extends Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "class" | "classList">,
    VariantProps<typeof fieldErrorVariants>,
    VariantSlotsClassProps<typeof fieldErrorVariants> {}

export function FieldError(props: FieldErrorProps) {
  const classes = createMemo(() => fieldErrorVariants());

  return (
    <p class={classes().root({ class: props.rootClass })} {...props}>
      <Icon.validationError
        class={classes().icon({ class: props.iconClass })}
      />
      <span>{props.children}</span>
    </p>
  );
}
