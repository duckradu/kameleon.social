export const paths = {
  signUp: "/sign-up",
  signIn: "/sign-in",

  notFound: "/404",

  actor: (actorPublicId: string) => ({
    profile: `/a/${actorPublicId}`,
    connections: `/a/${actorPublicId}/connections`,
  }),
};
