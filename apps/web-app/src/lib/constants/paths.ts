export const paths = {
  signUp: "/sign-up",
  signIn: "/sign-in",

  notFound: "/404",

  actor: (actorPublicId: string) => {
    const basePath = `/a/${actorPublicId}`;

    return {
      profile: basePath,

      connections: `${basePath}/connections`,

      record: (recordPublicId: string) => `${basePath}/r/${recordPublicId}`,
    };
  },

  settings: () => {
    const basePath = "/settings";

    return {
      root: basePath,

      // inviteCodes: `${basePath}/invite-codes`,
    };
  },
};
