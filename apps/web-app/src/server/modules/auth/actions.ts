import { action, cache } from "@solidjs/router";

import {
  getSessionActor$,
  signIn$,
  signOut$,
  signUp$,
} from "~/server/modules/auth/rpc";

export const getSessionActor = cache(getSessionActor$, "auth:session");

export const signUp = action(signUp$, "auth:signUp");

export const signIn = action(signIn$, "auth:signIn");

export const signOut = action(signOut$, "auth:signOut");
