import { JSX } from "solid-js";

export interface FormFieldHelperProps
  extends Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "classList"> {}

export function FormFieldHelper(props: FormFieldHelperProps) {
  return (
    <p
      {...props}
      classList={{
        "px-1 text-xs text-muted-foreground": true,
        [props.class!]: Boolean(props.class),
      }}
    />
  );
}
