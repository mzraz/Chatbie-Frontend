import { signInSA, signInWithToken, setupKey } from "src/configurationKeys";
const jwtServiceConfig = {
  signIn: signInSA,
  signUp: "api/auth/sign-up",
  accessToken: signInWithToken,
  organizationSignUp: setupKey,
};

export default jwtServiceConfig;
