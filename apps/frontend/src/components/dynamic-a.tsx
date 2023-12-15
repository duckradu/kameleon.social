"use client";

import { Accessor, ComponentProps, JSXElement, splitProps } from "solid-js";
import { A as BaseA, useLocation } from "solid-start";

export type DynamicAProps = {
  children: (props: { isActive: Accessor<boolean> }) => JSXElement;
} & Omit<ComponentProps<typeof BaseA>, "children">;

export function DynamicA(props: DynamicAProps) {
  const [, rest] = splitProps(props, ["children"]);
  const location = useLocation();

  const isActive = () =>
    Boolean(rest.end)
      ? location.pathname === rest.href
      : location.pathname.includes(rest.href);

  return <BaseA {...rest}>{props.children({ isActive })}</BaseA>;
}
