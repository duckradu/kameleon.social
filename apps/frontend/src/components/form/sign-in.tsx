import { createForm } from "@modular-forms/solid";
import { Static } from "@sinclair/typebox";
import { Show } from "solid-js";
import { useSearchParams } from "solid-start";

import { Button } from "~/components/ui/button";
import { FieldError } from "~/components/ui/field-error";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";

import { voyage } from "~/lib/voyage-client";

import { typeboxForm } from "~/utils/typebox-form";

export type SignInFormProps = {
  redirect?: boolean;
};

const isPending = false;

export function SignInForm() {
  const [searchParams] = useSearchParams();
  const [, { Form, Field }] = createForm<
    Static<typeof voyage.auth.POST.$s.body>
  >({
    initialValues: {
      email: searchParams.email,
    },
    validate: typeboxForm(voyage.auth.POST.$s.body),
  });

  const handleSubmit = async () => {};

  return (
    <Form class="grid gap-2" onSubmit={handleSubmit}>
      <Field name="email">
        {(field, props) => (
          <div class="grid gap-1">
            <Input dimension="lg" type="email" placeholder="Email" {...props} />
            <Show when={field.error}>
              <FieldError>{field.error}</FieldError>
            </Show>
          </div>
        )}
      </Field>
      <Field name="password">
        {(field, props) => (
          <div class="grid gap-1">
            <Input
              dimension="lg"
              type="password"
              placeholder="Password"
              {...props}
            />
            <Show when={field.error}>
              <FieldError>{field.error}</FieldError>
            </Show>
          </div>
        )}
      </Field>
      <Button dimension="lg" type="submit" disabled={isPending}>
        {isPending ? <Icon.spinner class="w-6 h-6 animate-spin" /> : "Sign In"}
      </Button>
    </Form>
  );
}
