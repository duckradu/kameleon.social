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
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",

      ghost: "bg-transparent text-secondary-foreground hover:bg-secondary",

      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    size: {
      sm: "h-8 px-1.6",
      default: "h-10 gap-1.5 px-3",
      lg: "h-12 gap-2",
      xl: "h-14 gap-3 rounded-lg",
    },
    iconOnly: {
      true: "",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      iconOnly: true,
      class: "w-8 p-0",
    },
    {
      size: "default",
      iconOnly: true,
      class: "w-10 p-0",
    },
    {
      size: "lg",
      iconOnly: true,
      class: "w-12 p-0",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button(originalProps: ButtonProps) {
  const [variantsProps, props] = splitProps(originalProps, [
    "variant",
    "size",
    "class",
  ]);

  return <button class={buttonVariants(variantsProps)} {...props} />;
}
