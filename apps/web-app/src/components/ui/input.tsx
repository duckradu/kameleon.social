import { createMemo, JSX } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";

export const inputVariants = tv({
  base: [
    "flex",
    "bg-input",
    "border border-input rounded-md",
    "text-sm",
    "px-4",
    "placeholder:text-muted-foreground",
    "disabled:(cursor-not-allowed opacity-50)",
  ],
  variants: {
    size: {
      default: "h-10",
      lg: "h-12",
      xl: "h-14 rounded-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface InputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export function Input(props: InputProps) {
  const classes = createMemo(() =>
    inputVariants({ ...props, class: props.class })
  );

  return <input id={props.name} {...props} class={classes()} />;
}
