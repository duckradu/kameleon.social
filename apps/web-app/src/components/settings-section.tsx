import { JSX, ParentProps, Show } from "solid-js";

export type SettingsSectionProps = ParentProps<{
  header?: string;
  description?: string;

  quickActions?: () => JSX.Element;
}>;

export function SettingsSection(props: SettingsSectionProps) {
  return (
    <section class="space-y-2">
      <Show when={props.header || props.description || props.quickActions}>
        <header class="flex">
          <div>
            <Show when={props.header}>
              <h2 class="font-medium">{props.header}</h2>
            </Show>
            <Show when={props.description}>
              <p class="text-sm text-muted-foreground">{props.description}</p>
            </Show>
          </div>

          <Show when={props.quickActions}>
            <div class="flex items-center justify-center ml-auto">
              {props.quickActions!()}
            </div>
          </Show>
        </header>
      </Show>

      <div>{props.children}</div>
    </section>
  );
}
