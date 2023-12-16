import {
  type FormErrors,
  type PartialValues,
  type ValidateForm,
} from "@modular-forms/solid";
import { type TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });

addFormats(ajv);
addErrors(ajv);

export function typeboxForm<TFieldValues extends TSchema>(
  schema: TFieldValues
): ValidateForm<TFieldValues> {
  const validate = ajv.compile(schema);

  return (values: PartialValues<TFieldValues>) => {
    const converted = Value.Convert(schema, values);

    const isValid = validate(converted);

    if (isValid) {
      return {};
    }

    return validate.errors?.reduce<any>((errors, error) => {
      const path = error.instancePath.replace("/", "").split("/").join(".");

      if (!errors[path]) {
        errors[path] = error.message;
      }

      return errors;
    }, {}) as FormErrors<TFieldValues>;
  };
}
