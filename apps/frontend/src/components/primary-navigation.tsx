import { For } from "solid-js";
import { Dynamic } from "solid-js/web";

import { DynamicA } from "~/components/dynamic-a";
import { Icon } from "~/components/ui/icon";

type NavigationItem = {
  displayText: string;
  href: string;
  icon: {
    active: SVGIcon;
    inactive: SVGIcon;
  };
};

const usePrimaryNavigationItems = (): NavigationItem[] => [
  {
    displayText: "Home",
    href: "/",
    icon: {
      active: Icon.home.solid,
      inactive: Icon.home.outline,
    },
  },
  // Temporary placeholder items
  {
    displayText: "News",
    href: "/news",
    icon: {
      active: Icon.news.solid,
      inactive: Icon.news.outline,
    },
  },
  {
    displayText: "Explore",
    href: "/explore",
    icon: {
      active: Icon.compass.solid,
      inactive: Icon.compass.outline,
    },
  },
  {
    displayText: "Shop",
    href: "/shop",
    icon: {
      active: Icon.shop.solid,
      inactive: Icon.shop.outline,
    },
  },
];

export function PrimaryNavigation() {
  const primaryNavigationItems = usePrimaryNavigationItems();

  return (
    <nav class="grid">
      <For each={primaryNavigationItems}>
        {(item) => <NavigationItem {...item} />}
      </For>
    </nav>
  );
}

export function AuthNavigation() {
  return (
    <nav class="grid">
      <NavigationItem
        displayText="Sign in"
        href="/sign-in"
        icon={{ active: Icon.login.solid, inactive: Icon.login.outline }}
      />
      <NavigationItem
        displayText="Sign up"
        href="/sign-up"
        icon={{ active: Icon.userPlus.solid, inactive: Icon.userPlus.outline }}
      />
    </nav>
  );
}

function NavigationItem(props: NavigationItem) {
  return (
    <DynamicA
      href={props.href}
      class="flex py-1 group"
      activeClass="font-semibold"
    >
      {({ isActive }) => (
        <div class="inline-flex itemsx-center gap-3 rounded-full p-3 group-hover:bg-muted">
          <Dynamic
            component={isActive() ? props.icon.active : props.icon.inactive}
            class="w-7 h-7"
            classList={{
              "text-brand": isActive(),
            }}
          />
          <span class="inline-flex pr-2 text-xl">{props.displayText}</span>
        </div>
      )}
    </DynamicA>
  );
}
