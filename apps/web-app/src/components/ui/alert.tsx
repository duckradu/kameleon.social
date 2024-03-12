import { JSX, ParentProps, Show, createMemo, splitProps } from "solid-js";
import { VariantProps, tv } from "tailwind-variants";

import { Icon } from "~/components/ui/icon";

export const alertVariants = tv({
  base: [
    "relative w-full p-4",
    "text-sm",
    "border rounded-lg",
    "[&>svg~*]:pl-7 [&>svg]-(absolute left-4 top-4)",
  ],
  variants: {
    variant: {
      // TODO: Remove the !important somehow
      destructive: "!border-red-600 text-red-600",
    },
  },
  defaultVariants: {
    variant: "destructive",
  },
});

export interface AlertProps
  extends JSX.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants>,
    ParentProps {
  icon?: "danger" | SVGIcon | false;
}

export function Alert(originalProps: AlertProps) {
  const [{ icon, children }, props] = splitProps(originalProps, [
    "icon",
    "children",
  ]);

  const IconElement = createMemo(() => getIcon(icon ?? "danger"));

  return (
    <div {...originalProps} class={alertVariants(props)}>
      <Show when={IconElement()}>{IconElement() as JSX.Element}</Show>
      <div>{children}</div>
    </div>
  );
}

export function getIcon(icon: AlertProps["icon"]) {
  if (typeof icon === "string") {
    switch (icon) {
      case "danger":
        return <Icon.dangerTriangle />;
    }
  }

  return icon;
}
