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
    "focus-visible-(outline-none ring-2 ring-ring ring-offset-2 ring-offset-background)",
    "disabled:(cursor-not-allowed opacity-50)",
  ],
  variants: {
    dimension: {
      sm: "h-10",
      md: "h-12",
      lg: "h-14 rounded-lg",
    },
  },
  defaultVariants: {
    dimension: "md",
  },
});

export interface InputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export function Input(props: InputProps) {
  const classes = createMemo(() =>
    inputVariants({ dimension: props.dimension, class: props.class })
  );

  return <input id={props.name} {...props} class={classes()} />;
}
