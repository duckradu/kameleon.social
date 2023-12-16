import { createForm } from "@modular-forms/solid";
import { useSearchParams } from "solid-start";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function SignInForm() {
  const [searchParams] = useSearchParams();
  const [, { Form }] = createForm({
    initialValues: {
      email: searchParams.email,
    },
  });

  const handleSubmit = async () => {};

  return (
    <Form class="grid gap-2" onSubmit={handleSubmit}>
      <Input dimension="lg" type="email" placeholder="Email" name="email" />
      <Input
        dimension="lg"
        type="password"
        placeholder="Password"
        name="password"
      />
      <Button dimension="lg" type="submit">
        Sign In
      </Button>
    </Form>
  );
}
