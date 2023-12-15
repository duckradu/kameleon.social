// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";

import { Providers } from "~/components/providers";

import "@unocss/reset/tailwind-compat.css";

import "virtual:uno.css";

import "~/styles/root.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>kameleon.social</Title>
        <Link rel="icon" href="/assets/icons/favicon.svg" />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Providers>
              <Routes>
                <FileRoutes />
              </Routes>
            </Providers>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
