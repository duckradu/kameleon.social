import { action } from "@solidjs/router";

import { signIn$, signOut$, signUp$ } from "~/server/modules/auth/rpc";

export const signUp = action(signUp$, "auth:signUp");

export const signIn = action(signIn$, "auth:signIn");

export const signOut = action(signOut$, "auth:signOut");
