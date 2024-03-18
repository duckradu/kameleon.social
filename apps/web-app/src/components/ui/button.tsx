import { JSX, splitProps } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: [
    "inline-flex justify-center items-center",
    "rounded-md",
    "text-sm font-medium leading-relaxed",
    "px-4",
    "disabled-(opacity-50 pointer-events-none)",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      ghost: "bg-transparent text-secondary-foreground hover:bg-secondary",
    },
    shape: {
      squircle: true,
    },
    size: {
      xs: "h-8 px-1.6",
      sm: "h-10 gap-1.5 px-3",
      md: "h-12 gap-2",
      lg: "h-14 gap-3 rounded-lg",
    },
  },
  compoundVariants: [
    {
      shape: "squircle",
      size: "sm",
      class: "w-10 p-0",
    },
    {
      shape: "squircle",
      size: "md",
      class: "w-12 p-0",
    },
    {
      shape: "squircle",
      size: "lg",
      class: "w-14 p-0",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button(originalProps: ButtonProps) {
  const [{ children }, props] = splitProps(originalProps, ["children"]);

  return (
    <button {...props} class={buttonVariants(props)}>
      {children}
    </button>
  );
}
