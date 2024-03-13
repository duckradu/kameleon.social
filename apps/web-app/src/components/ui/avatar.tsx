import * as avatar from "@zag-js/avatar";
import { useMachine, normalizeProps } from "@zag-js/solid";
import {
  JSX,
  Show,
  createMemo,
  createUniqueId,
  mergeProps,
  splitProps,
} from "solid-js";
import { VariantProps, tv } from "tailwind-variants";

export const avatarVariants = tv({
  slots: {
    root: "relative shrink-0 overflow-hidden rounded-full",
    fallback: [
      "aspect-square bg-muted text-muted-foreground rounded-inherit font-semibold",
      "data-[state=visible]-(flex items-center justify-center)",
    ],
    image: "aspect-square object-cover w-full rounded-inherit",
  },
  variants: {
    size: {
      md: {
        root: "w-10 h-10",
      },
      profile: {
        root: "w-24 h-24",
        fallback: "text-4xl",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface AvatarProps
  extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, "class" | "classList">,
    VariantSlotsClassProps<typeof avatarVariants>,
    VariantProps<typeof avatarVariants> {
  fallback: JSX.Element;
  displayImage?: boolean;
}

export function Avatar(originalProps: AvatarProps) {
  const props = mergeProps({ displayImage: true }, originalProps);
  const [componentProps, imgNodeProps] = splitProps(props, [
    "fallback",
    "displayImage",
    "rootClass",
    "fallbackClass",
    "imageClass",
  ]);

  const [state, send] = useMachine(avatar.machine({ id: createUniqueId() }));

  const api = createMemo(() => avatar.connect(state, send, normalizeProps));
  const classes = createMemo(() => avatarVariants(imgNodeProps));

  return (
    <div
      {...api().rootProps}
      class={classes().root({ class: componentProps.rootClass })}
    >
      <span
        {...api().fallbackProps}
        class={classes().fallback({ class: componentProps.fallbackClass })}
      >
        {componentProps.fallback}{" "}
      </span>

      <Show when={componentProps.displayImage}>
        <img
          {...api().imageProps}
          {...imgNodeProps}
          class={classes().image({ class: componentProps.imageClass })}
        />
      </Show>
    </div>
  );
}
