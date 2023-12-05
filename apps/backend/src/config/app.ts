export default {
  auth: {
    accessToken: {
      salt: "access_token",
      name: "access_token",
      maxAge: 2 * 24 * 60 * 60,
    },
    refreshToken: {
      salt: "refresh_token",
      name: "refresh_token",
      maxAge: 30 * 24 * 60 * 60,
    },
  },
};
