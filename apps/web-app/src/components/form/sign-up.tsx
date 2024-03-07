import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";

import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormFieldError } from "~/components/ui/form-field-error";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";

import { signUp } from "~/server/modules/auth/actions";

export type SignUpFormProps = {
  inviteCode?: string;
  redirectTo?: string;
};

export function SignUpForm(props: SignUpFormProps) {
  const submission = useSubmission(signUp);

  return (
    <form action={signUp} method="post" class="grid gap-2">
      <input name="inviteCode" type="hidden" value={props.inviteCode} />
      <input name="redirectTo" type="hidden" value={props.redirectTo} />

      <Show when={submission.result?.error}>
        <Alert>{submission.result?.error}</Alert>
      </Show>

      <div class="grid gap-1">
        <Input size="lg" name="email" type="email" placeholder="Email" />
        <Show when={submission.result?.errors?.email}>
          <FormFieldError>{submission.result!.errors!.email}</FormFieldError>
        </Show>
      </div>

      <div class="grid gap-1">
        <Input
          size="lg"
          name="password"
          type="password"
          placeholder="Password"
        />
        <Show when={submission.result?.errors?.password}>
          <FormFieldError>{submission.result!.errors!.password}</FormFieldError>
        </Show>
      </div>

      <Button size="lg" type="submit" disabled={submission.pending}>
        {submission.pending ? (
          <Icon.spinner class="w-6 h-6 animate-spin" />
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  );
}
