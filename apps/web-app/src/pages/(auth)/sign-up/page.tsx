import { A, Navigate, useSearchParams } from "@solidjs/router";

import { useSession } from "~/components/context/session";
import { SignUpForm } from "~/components/form/sign-up";
import { KameleonTitle } from "~/components/kameleon-title";
import { Icon } from "~/components/ui/icon";

import { paths } from "~/lib/constants/paths";

export default function SignUp() {
  const { actor } = useSession();

  if (actor()) {
    return <Navigate href="/" />;
  }

  const [searchParams] = useSearchParams();

  return (
    <>
      <KameleonTitle>Sign up</KameleonTitle>

      <div class="flex flex-col gap-2 text-center">
        <A href="/" class="mx-auto">
          <Icon.logo.solid class="w-8 h-8" />
        </A>
        <h1 class="text-2xl font-semibold tracking-tight">Nice to meet you</h1>
        <p class="text-sm text-muted-foreground">We're excited you're here</p>
      </div>

      <SignUpForm
        inviteCode={searchParams.inviteCode}
        redirectTo={searchParams.redirectTo || "/"}
      />

      <div class="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <A href={paths.signIn} class="text-brand">
          Sign in
        </A>
      </div>
    </>
  );
}
