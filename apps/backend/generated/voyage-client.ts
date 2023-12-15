// ! Do not modify this file unless you know what you are doing.
// ! Any changes will be overwritten next time this is generated.
// ! To update the generated output look inside `/src/plugins/voyage-client-generator/index.ts`

export interface SignInWithCredentials {
  email: string;
  password: string;
}
export interface SelectActor {
  publicId: string;
  email: string;
  name: string | null;
  handle: string;
  bio: string | null;
  dob: string | null;
  locale: string;
  coverUrl: string | null;
  avatarUrl: string | null;
  externalUrl: string | null;
  emailVerifiedAt: string | null;
}
export interface auth_GET {
  200: SelectActor;
}
export interface AccessToken {
  accessToken: string;
}
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
  auth: {
    PATCH: callback("/api/v1/auth", "PATCH"),
    DELETE: callback("/api/v1/auth", "DELETE"),
    GET: callback<void, auth_GET>("/api/v1/auth", "GET"),
    refresh: {
      POST: callback<void, auth_refresh_POST>("/api/v1/auth/refresh", "POST"),
    },
    POST: callback<SignInWithCredentials, auth_POST>("/api/v1/auth", "POST"),
  },
  test: { GET: callback("/api/v1/test", "GET") },
});
