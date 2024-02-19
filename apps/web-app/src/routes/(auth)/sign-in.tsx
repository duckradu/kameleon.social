import { A } from "@solidjs/router";

import { CentralFocusLayout } from "~/components/central-focus-layout";
import { SignInForm } from "~/components/form/sign-in";
import { KameleonTitle } from "~/components/kameleon-title";
import { Icon } from "~/components/ui/icon";

export default function SignIn() {
  return (
    <>
      <KameleonTitle>Sign in</KameleonTitle>

      <CentralFocusLayout>
        <main class="max-w-sm w-full space-y-6">
          <div class="flex flex-col gap-2 text-center">
            <A href="/" class="mx-auto">
              <Icon.logo.solid class="w-8 h-8" />
            </A>
            <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p class="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <SignInForm />

          <div class="flex justify-between text-sm text-brand">
            <A href="/sign-up">Create an account</A>
            <A href="/recover-access">Forgot your password?</A>
          </div>
        </main>
      </CentralFocusLayout>
    </>
  );
}
