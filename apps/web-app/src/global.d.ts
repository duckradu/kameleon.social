/// <reference types="@solidjs/start/env" />

import { JSX } from "solid-js";

declare global {
  type SVGIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element;

  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  type VariantSlotsClassType<T extends any> = T extends string
    ? {
        [key in T as `${key}Class`]?: string;
      }
    : never;

  type VariantSlotsClassProps<Component extends (...args: any) => any> =
    UnionToIntersection<VariantSlotsClassType<keyof ReturnType<Component>>>;
}

export {};
