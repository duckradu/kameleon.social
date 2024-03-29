import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";

import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormFieldError } from "~/components/ui/form-field-error";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";

import { signIn } from "~/server/modules/auth/actions";

export type SignInFormProps = {
  redirectTo?: string;
};

export function SignInForm(props: SignInFormProps) {
  const submission = useSubmission(signIn);

  return (
    <form action={signIn} method="post" class="grid gap-2">
      <input name="redirectTo" type="hidden" value={props.redirectTo} />

      <Show when={submission.result?.error}>
        <Alert>{submission.result?.error}</Alert>
      </Show>

      <div class="grid gap-1">
        <Input size="xl" name="email" type="email" placeholder="Email" />
        <Show when={submission.result?.validationErrors?.email}>
          <FormFieldError>
            {submission.result!.validationErrors!.email}
          </FormFieldError>
        </Show>
      </div>

      <div class="grid gap-1">
        <Input
          size="xl"
          name="password"
          type="password"
          placeholder="Password"
        />
        <Show when={submission.result?.validationErrors?.password}>
          <FormFieldError>
            {submission.result!.validationErrors!.password}
          </FormFieldError>
        </Show>
      </div>

      <Button size="xl" type="submit" disabled={submission.pending}>
        <Show when={submission.pending} fallback="Sign in">
          <Icon.spinner class="w-6 h-6 animate-spin" />
        </Show>
      </Button>
    </form>
  );
}
