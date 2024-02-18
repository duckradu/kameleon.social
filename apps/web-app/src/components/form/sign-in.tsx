import { action, redirect, useSubmission } from "@solidjs/router";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { FormFieldError } from "~/components/ui/form-field-error";

export function SignInForm() {
  return (
    <form action={undefined} method="post" class="grid gap-2">
      <div class="grid gap-1">
        <Input size="lg" name="email" type="email" placeholder="Email" />
      </div>
      <Input size="lg" name="password" type="password" placeholder="Password" />
      {/* <Button size="lg" type="submit" disabled={formSubmission.pending}>
        {formSubmission.pending ? (
          <Icon.spinner class="w-6 h-6 animate-spin" />
        ) : (
          "Sign in"
        )}
      </Button> */}
    </form>
  );
}
