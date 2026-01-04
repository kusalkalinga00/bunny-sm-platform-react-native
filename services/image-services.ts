export const getUserImageUrl = (path: string | null | undefined) => {
  if (path) {
    return {
      uri: path,
    };
  } else {
    return require("../assets/images/defaultUser.png");
  }
};
