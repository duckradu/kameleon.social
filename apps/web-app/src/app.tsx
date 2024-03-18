// @refresh reload

import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "@unocss/reset/tailwind-compat.css";

import "virtual:uno.css";

import { SessionProvider } from "~/components/context/session";
import { ToastProvider } from "~/components/context/toast";
import { KameleonTitle } from "~/components/kameleon-title";

import "~/styles/root.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <KameleonTitle />
          <Suspense>
            <SessionProvider>
              <ToastProvider>{props.children}</ToastProvider>
            </SessionProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
