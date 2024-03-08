// @refresh reload

import { MetaProvider } from "@solidjs/meta";
import { RouteDefinition, Router } from "@solidjs/router";
import { Suspense, lazy } from "solid-js";

import "@unocss/reset/tailwind-compat.css";

import "virtual:uno.css";

import { KameleonTitle } from "~/components/kameleon-title";
import { SessionProvider } from "~/components/context/session";

import "~/styles/root.css";

const routes: RouteDefinition[] = [
  // * Auth
  {
    path: "/",
    component: lazy(() => import("~/pages/external-layout")),
    children: [
      {
        path: "/sign-in",
        component: lazy(() => import("~/pages/(auth)/sign-in/page")),
      },
      {
        path: "/sign-up",
        component: lazy(() => import("~/pages/(auth)/sign-up/page")),
      },
    ],
  },
  {
    path: "/",
    component: lazy(() => import("~/pages/layout")),
    children: [
      {
        path: "/",
        component: lazy(() => import("~/pages/page")),
      },
      // * Actor profile
      {
        path: "/a/:actorPublicId",
        component: lazy(() => import("~/pages/(actor)/(profile)/layout")),
        children: [
          {
            path: "/",
            component: lazy(
              () => import("~/pages/(actor)/(profile)/activity/page")
            ),
          },
          {
            path: "/moments",
            component: lazy(
              () => import("~/pages/(actor)/(profile)/moments/page")
            ),
          },
          {
            path: "/connections",
            component: lazy(
              () => import("~/pages/(actor)/(profile)/connections/page")
            ),
          },
        ],
      },
      // * Settings
      {
        path: "/a/:actorPublicId/settings",
        children: [
          {
            path: "/",
            component: lazy(() => import("~/pages/(actor)/settings/page")),
          },
          {
            path: "/invite-codes",
            component: lazy(
              () => import("~/pages/(actor)/settings/invite-codes/page")
            ),
          },
        ],
      },
      // * Record
      {
        path: "/a/:actorPublicId/r/:recordPublicId",
        component: lazy(() => import("~/pages/(actor)/record/page")),
      },
    ],
  },
  {
    path: "/",
    component: lazy(() => import("~/pages/external-layout")),
    children: [
      {
        path: "*404",
        component: lazy(() => import("~/pages/[...404]")),
      },
    ],
  },
];

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <KameleonTitle />
          <Suspense>
            <SessionProvider>{props.children}</SessionProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      {routes}
    </Router>
  );
}
