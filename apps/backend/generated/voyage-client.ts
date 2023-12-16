// ! Do not modify this file unless you know what you are doing.
// ! Any changes will be overwritten next time this is generated.
// ! To update the generated output look inside `/src/plugins/voyage-client-generator/index.ts`

import { Static, Type } from "@sinclair/typebox";

export type SignInWithCredentials = Static<typeof SignInWithCredentials>;
export const SignInWithCredentials = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
});

export type SelectActor = Static<typeof SelectActor>;
export const SelectActor = Type.Object({
  publicId: Type.String({ minLength: 12, maxLength: 12 }),
  email: Type.String(),
  name: Type.Union([Type.String({ maxLength: 70 }), Type.Null()]),
  handle: Type.String({ maxLength: 32 }),
  bio: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
  dob: Type.Union([Type.String(), Type.Null()]),
  locale: Type.String({ maxLength: 12 }),
  coverUrl: Type.Union([Type.String(), Type.Null()]),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  externalUrl: Type.Union([Type.String(), Type.Null()]),
  emailVerifiedAt: Type.Union([Type.String(), Type.Null()]),
});
export interface auth_GET {
  200: SelectActor;
}

export type AccessToken = Static<typeof AccessToken>;
export const AccessToken = Type.Object({ accessToken: Type.String() });
export interface auth_refresh_POST {
  200: AccessToken;
}

export interface auth_POST {
  200: AccessToken;
}

export const createVoyageClient = (
  callback: <
    TPayload extends any = void,
    TReturnMap extends object | unknown = unknown,
  >(
    url: string,
    method: string,
  ) => (payload: TPayload) => Promise<TReturnMap[keyof TReturnMap]>,
) => ({
  test: { GET: Object.assign(callback("/api/v1/test", "GET")) },
  auth: {
    PATCH: Object.assign(callback("/api/v1/auth", "PATCH")),
    DELETE: Object.assign(callback("/api/v1/auth", "DELETE")),
    GET: Object.assign(callback<void, auth_GET>("/api/v1/auth", "GET")),
    refresh: {
      POST: Object.assign(
        callback<void, auth_refresh_POST>("/api/v1/auth/refresh", "POST"),
      ),
    },
    POST: Object.assign(
      callback<SignInWithCredentials, auth_POST>("/api/v1/auth", "POST"),
      { $s: { body: SignInWithCredentials } },
    ),
  },
});
