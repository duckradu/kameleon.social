// @refresh reload

import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";

import { KameleonTitle } from "~/components/kameleon-title";

import "@unocss/reset/tailwind-compat.css";

import "virtual:uno.css";

import "~/styles/root.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <KameleonTitle />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
