import { A } from "solid-start";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";

export default function SignInPage() {
  return (
    <div class="flex justify-center items-center p-4 h-screen">
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

        <form class="grid gap-2">
          <Input dimension="lg" type="email" placeholder="Email" />
          <Input dimension="lg" type="password" placeholder="Password" />
          <Button dimension="lg" type="submit">
            Sign In
          </Button>
        </form>

        <div class="flex justify-between text-sm text-muted-foreground">
          <A
            href="/sign-up"
            class="underline underline-offset-4 hover:text-brand"
          >
            Create an account
          </A>
          <A
            href="/recover-access"
            class="underline underline-offset-4 hover:text-brand text-right"
          >
            Forgot your password?
          </A>
        </div>
      </div>
    </div>
  );
}
