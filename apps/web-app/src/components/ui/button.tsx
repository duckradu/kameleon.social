import { createMemo, JSX } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: [
    "inline-flex justify-center items-center",
    "rounded-md",
    "text-sm font-medium",
    "px-4",
    "transition-colors",
    "focus-visible-(outline-none ring-2 ring-ring ring-offset-2 ring-offset-background)",
    "disabled-(opacity-50 pointer-events-none)",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    },
    size: {
      sm: "h-10",
      md: "h-12",
      lg: "h-14 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button(props: ButtonProps) {
  const classes = createMemo(() =>
    buttonVariants({ ...props, class: props.class })
  );

  return <button {...props} class={classes()} />;
}
