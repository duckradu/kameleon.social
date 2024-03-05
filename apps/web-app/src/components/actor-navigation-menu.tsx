import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/solid";
import { For, createMemo, createUniqueId } from "solid-js";
import { Dynamic } from "solid-js/web";

import { ActiveAnchor } from "~/components/active-anchor";
import { SessionProviderProps, useSession } from "~/components/context/session";
import { Avatar } from "~/components/ui/avatar";
import { Icon } from "~/components/ui/icon";

import { signOut } from "~/server/modules/auth/actions";

import { paths } from "~/lib/constants/paths";

type NavigationItem = {
  id: string;
  displayText: string;
  href: string;
  icon: {
    active: SVGIcon;
    inactive: SVGIcon;
  };
  end?: boolean;
};

const useActorNavigationItems = (
  // TODO: Type this properly
  actor: SessionProviderProps["sessionActor"]
): NavigationItem[] =>
  [
    {
      displayText: "Profile",
      href: paths.actor.profile(actor().pid),
      icon: {
        active: Icon.user.solid,
        inactive: Icon.user.outline,
      },
      end: true,
    },
    // {
    //   displayText: "Notifications",
    //   href: "/a/notifications",
    //   icon: {
    //     active: Icon.bell.solid,
    //     inactive: Icon.bell.outline,
    //   },
    // },
    // {
    //   displayText: "Saved",
    //   href: "/a/saved",
    //   icon: {
    //     active: Icon.galleryFavourite.solid,
    //     inactive: Icon.galleryFavourite.outline,
    //   },
    // },
    // {
    //   displayText: "Settings",
    //   href: "/a/settings",
    //   icon: {
    //     active: Icon.gear.solid,
    //     inactive: Icon.gear.outline,
    //   },
    // },
  ].map((i) => ({ ...i, id: createUniqueId() }));

const MENU_ITEM_CLASS =
  "flex flex-row gap-3 items-center w-full px-2.5 py-3 bg-popover hover:bg-popover-foreground/5 focus:bg-popover-foreground/5";

export function ActorNavigationMenu() {
  const { sessionActor } = useSession();
  const actorNavigationItems = useActorNavigationItems(sessionActor);

  const [state, send] = useMachine(
    menu.machine({
      id: createUniqueId(),
      positioning: {
        offset: {
          mainAxis: 8,
        },
      },
    })
  );

  const api = createMemo(() => menu.connect(state, send, normalizeProps));

  return (
    <>
      <button
        {...api().triggerProps}
        class="group flex gap-3 p-3 w-full rounded-full bg-transparent hover:bg-popover focus:bg-popover data-[state=open]:bg-popover"
      >
        <Avatar fallback="RD" />
        <span class="inline-flex items-center justify-between w-full overflow-hidden">
          <span class="text-sm text-left mr-1 overflow-hidden">
            <p class="font-semibold text-ellipsis overflow-hidden">
              {sessionActor().name}
            </p>
            <p class="text-muted-foreground text-ellipsis overflow-hidden">
              @{sessionActor().pid}
            </p>
          </span>

          <span class="flex items-center justify-center shrink-0">
            <Icon.menuDots.solid />
          </span>
        </span>
      </button>

      <div {...api().positionerProps} class="w-full z-40">
        <ul
          {...api().contentProps}
          class="rounded-2xl border border-border bg-popover text-popover-foreground overflow-hidden"
        >
          <For each={actorNavigationItems}>
            {(item) => (
              <li {...api().getItemProps({ id: item.id })}>
                <ActiveAnchor href={item.href} end={item.end}>
                  {({ isActive }) => (
                    <div class={MENU_ITEM_CLASS}>
                      <Dynamic
                        component={
                          isActive() ? item.icon.active : item.icon.inactive
                        }
                        class="w-7 h-7"
                        classList={{
                          "text-brand": isActive(),
                        }}
                      />
                      <span>{item.displayText}</span>
                    </div>
                  )}
                </ActiveAnchor>
              </li>
            )}
          </For>
          <li {...api().getItemProps({ id: createUniqueId() })}>
            <form action={signOut} method="post">
              <button class={MENU_ITEM_CLASS}>
                <Icon.logout class="w-7 h-7" />
                <span>Sign out</span>
              </button>
            </form>
          </li>
        </ul>
      </div>
    </>
  );
}
