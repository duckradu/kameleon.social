import { For, Show, mergeProps } from "solid-js";
import { A } from "@solidjs/router";
import { Dynamic } from "solid-js/web";

import { Icon } from "~/components/ui/icon";

import { paths } from "~/lib/constants/paths";

export type RecordFeedEmptyMessageProps = {
  title?: string;
  description?: string | string[];

  actionList?: (Omit<IconNavigationItem, "icon"> & {
    icon: SVGIcon;
  })[];
};

export function RecordFeedEmptyMessage(
  originalProps: RecordFeedEmptyMessageProps
) {
  const props = mergeProps(
    {
      title: "You've reached the end!",
      description: [
        "You've explored all the content available in this feed.",
        "But don't worry, there's still more to do:",
      ],
      actionList: getDefaultActionList(),
    },
    originalProps
  );

  return (
    <>
      {/* Please forgive :'( */}
      <div
        class="relative h-8 before-(content-[''] block w-full h-8 absolute top-0 left-0 bg-[linear-gradient(-45deg,hsl(var(--border))_16px,transparent_0),linear-gradient(45deg,hsl(var(--border))_16px,transparent_0)] bg-repeat-x bg-[length:32_32])
    after-(content-[''] block w-full h-8 absolute top-0.5 left-0 bg-[linear-gradient(-45deg,hsl(var(--background))_16px,transparent_0),linear-gradient(45deg,hsl(var(--background))_16px,transparent_0)] bg-repeat-x bg-[length:32_32])"
      />
      <section class="text-center space-y-4 py-layout">
        <header class="space-y-2">
          <h2 class="text-lg font-semibold leading-none tracking-tight">
            {props.title}
          </h2>
          <div>
            <Show
              when={Array.isArray(props.description)}
              fallback={
                <p class="text-sm text-muted-foreground">
                  {props.description as string}
                </p>
              }
            >
              <For each={props.description as string[]}>
                {(p) => <p class="text-sm text-muted-foreground">{p}</p>}
              </For>
            </Show>
          </div>
        </header>

        <footer class="flex justify-center gap-3">
          <For each={props.actionList}>
            {(actionItem) => (
              <A
                href={actionItem.href}
                class="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-xl"
              >
                <Dynamic component={actionItem.icon} />
              </A>
            )}
          </For>
        </footer>
      </section>
    </>
  );
}

export function getDefaultActionList() {
  return [
    {
      displayText: "Search",
      href: paths.explore.search,
      icon: Icon.magnifier.outline,
    },
    {
      displayText: "Connect",
      href: paths.explore.actors,
      icon: Icon.usersGroupTwo.outline,
    },
    {
      displayText: "Explore",
      href: paths.explore.root,
      icon: Icon.compass.outline,
    },
  ];
}
