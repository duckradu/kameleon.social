// @refresh reload

import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "@unocss/reset/tailwind-compat.css";

import "virtual:uno.css";

import { SessionProvider } from "~/components/context/session";
import { KameleonTitle } from "~/components/kameleon-title";

import "~/styles/root.css";

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
      <FileRoutes />
    </Router>
  );
}
