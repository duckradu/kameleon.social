import { ParentProps } from "solid-js";

export type ProfilePageEmptyMessageProps = ParentProps<{
  title: string;
  description: string;
}>;

export function ProfilePageEmptyMessage(props: ProfilePageEmptyMessageProps) {
  return (
    <div class="space-y-4 py-8 text-center">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold leading-none tracking-tight">
          {props.title}
        </h1>
        <p class="text-muted-foreground">{props.description}</p>
      </div>

      {props.children}
    </div>
  );
}
