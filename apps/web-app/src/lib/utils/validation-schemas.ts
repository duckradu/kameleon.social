import { minLength, string, email as emailPipelineAction } from "valibot";

export const email = string([
  minLength(1, "Please enter a valid email"),
  emailPipelineAction("Please enter a valid email"),
]);

export const password = string([
  minLength(1, "Please enter a valid password"),
  minLength(8, "The password must have 8 characters or more"),
]); // TODO: Improve validation
