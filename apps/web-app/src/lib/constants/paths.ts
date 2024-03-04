export const paths = {
  signUp: "/sign-up",
  signIn: "/sign-in",

  notFound: "/404",

  actor: {
    profile: (actorPublicId: string) => `/a/${actorPublicId}`,
    connections: (actorPublicId: string) => `/a/${actorPublicId}/connections`,
  },
};
