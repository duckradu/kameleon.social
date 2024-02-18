import { Title } from "@solidjs/meta";
import { ParentProps } from "solid-js";

export type KameleonTitleProps = ParentProps;

export function KameleonTitle(props: KameleonTitleProps) {
  return (
    <Title>
      {[props.children, "kameleon.social"].filter(Boolean).join(" | ")}
    </Title>
  );
}
