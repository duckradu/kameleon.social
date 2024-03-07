import { SchemaIssues } from "valibot";

export type RPCResponse<
  TValidationErrors extends Record<string, string> | null,
  TError = unknown,
  TData = unknown
> =
  | {
      data: NonNullable<TData>;
      error: null;
      validationErrors: null;
      success: true;
    }
  | {
      data: undefined;
      error: TError;
      validationErrors: null;
      success: false;
    }
  | {
      data: undefined;
      error: null;
      validationErrors: TValidationErrors;
      success: false;
    };

export function rpcSuccessResponse<TData = unknown>(
  data: NonNullable<TData>
): RPCResponse<null, null, TData> {
  return {
    data,
    error: null,
    validationErrors: null,
    success: true,
  };
}

export function rpcErrorResponse<TError extends { message: string }>(
  error: TError
): RPCResponse<null, TError, undefined> {
  return {
    data: undefined,
    error,
    validationErrors: null,
    success: false,
  };
}

export function rpcValidationErrorResponse(
  errors: SchemaIssues
): RPCResponse<Record<string, string>, null, undefined> {
  return {
    data: undefined,
    error: null,
    validationErrors: Object.fromEntries(
      errors.map((error) => [
        error.path?.map((item) => item.key).join(".") || "global",
        error.message,
      ])
    ),
    success: false,
  };
}
