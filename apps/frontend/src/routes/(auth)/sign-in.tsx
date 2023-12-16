import { A } from "solid-start";

import { SignInForm } from "~/components/form/sign-in";
import { Icon } from "~/components/ui/icon";

export default function SignInPage() {
  return (
    <div class="space-y-6 max-w-sm w-full">
      <div class="flex flex-col gap-2 text-center">
        <A href="/" class="mx-auto">
          <Icon.logo.solid class="w-7.5 h-7.5" />
        </A>
        <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p class="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <SignInForm />

      <div class="flex justify-between text-sm text-muted-foreground">
        <A href="/sign-up" class="hover:underline underline-offset-4">
          Create an account
        </A>
        <A
          href="/recover-access"
          class="hover:underline underline-offset-4 text-right"
        >
          Forgot your password?
        </A>
      </div>
    </div>
  );
}
