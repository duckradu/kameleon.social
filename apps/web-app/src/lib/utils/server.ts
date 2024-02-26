import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { SchemaIssues } from "valibot";

import { paths } from "~/lib/constants/paths";

export type ServerResponse<TResponse = any> = {
  data?: TResponse;
  error?: string;
  errors?: Record<string, string>;
  success: boolean;
};

export function serverSuccessResponse<TResponse = any>(
  data?: TResponse
): ServerResponse {
  return { data, success: true };
}

export function serverErrorResponse<TResponse extends { message: string }>(
  error: TResponse
): ServerResponse {
  return { error: error.message, success: false };
}

export function serverParseErrorResponse(issues: SchemaIssues): ServerResponse {
  return {
    errors: Object.fromEntries(
      issues.map((issue) => [
        issue.path?.map((item) => item.key).join(".") || "global",
        issue.message,
      ])
    ),
    success: false,
  };
}

export function getRequestEventOrThrow() {
  const event = getRequestEvent();

  if (!event) {
    throw redirect(paths.notFound, { status: 500 });
  }

  return event;
}
