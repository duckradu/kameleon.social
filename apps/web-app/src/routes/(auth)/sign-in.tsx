import { A, Navigate, useSearchParams } from "@solidjs/router";

import { useSession } from "~/components/context/session";
import { SignInForm } from "~/components/form/sign-in";
import { KameleonTitle } from "~/components/kameleon-title";
import { Icon } from "~/components/ui/icon";

import { paths } from "~/lib/constants/paths";

export default function SignIn() {
  const { actor } = useSession();

  if (actor()) {
    return <Navigate href="/" />;
  }

  const [searchParams] = useSearchParams();

  return (
    <>
      <KameleonTitle>Sign in</KameleonTitle>

      <div class="flex flex-col gap-2 text-center">
        <A href="/" class="mx-auto">
          <Icon.logo.solid class="w-8 h-8" />
        </A>
        <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p class="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <SignInForm redirectTo={searchParams.redirectTo || "/"} />

      <div class="flex justify-between text-sm text-brand [&>a:hover]-(underline underline-offset-3)">
        <A href={paths.signUp}>Create an account</A>
        <A href="/recover-access">Forgot your password?</A>
      </div>
    </>
  );
}
