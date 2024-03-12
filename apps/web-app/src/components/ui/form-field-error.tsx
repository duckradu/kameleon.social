import { createMemo, JSX, splitProps } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";

import { Icon } from "~/components/ui/icon";

export const formFieldErrorVariants = tv({
  slots: {
    root: ["flex items-center gap-1", "text-xs text-red-600", "px-1"],
    icon: "w-4 h-4",
  },
});

export interface FormFieldErrorProps
  extends Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "class" | "classList">,
    VariantProps<typeof formFieldErrorVariants>,
    VariantSlotsClassProps<typeof formFieldErrorVariants> {}

export function FormFieldError(originalProps: FormFieldErrorProps) {
  const [{ children }, props] = splitProps(originalProps, ["children"]);

  const classes = createMemo(() => formFieldErrorVariants());

  return (
    <p {...props} class={classes().root({ ...props, class: props.rootClass })}>
      <Icon.dangerTriangle
        class={classes().icon({ ...props, class: props.iconClass })}
      />
      <span>{children}</span>
    </p>
  );
}
