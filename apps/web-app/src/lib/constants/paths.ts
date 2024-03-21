export const paths = {
  signUp: "/sign-up",
  signIn: "/sign-in",

  notFound: "/404",

  actor: (actorPublicId: string) => {
    const basePath = `/a/${actorPublicId}`;

    return {
      profile: basePath,
      moments: `${basePath}/moments`,
      connections: `${basePath}/connections`,

      storage: `${basePath}/storage`,
      settings: {
        root: `${basePath}/settings`,

        // inviteCodes: `${basePath}/invite-codes`,
      },

      record: (recordPublicId: string) => `${basePath}/r/${recordPublicId}`,
    };
  },
};
