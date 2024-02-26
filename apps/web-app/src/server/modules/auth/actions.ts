import { action, cache } from "@solidjs/router";

import {
  getSessionActor$,
  signIn$,
  signOut$,
  signUp$,
} from "~/server/modules/auth/handlers";

export const getSessionActor = cache(getSessionActor$, "session");

export const signUp = action(signUp$, "signUp");

export const signIn = action(signIn$, "signIn");

export const signOut = action(signOut$, "signOut");
