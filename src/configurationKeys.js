URLTOPOINT = process.env.REACT_APP_BASE_URL;

module.exports = {
  signInSA: `${URLTOPOINT}/api/users/signIn`,
  signUpSA: `${URLTOPOINT}/api/users/signUp/organizations/`,
  signInWithToken: `${URLTOPOINT}/api/users/authenticate/refreshToken`,
  setupKey: `${URLTOPOINT}/api/users/organizations/`,
  serviceSetup: `${URLTOPOINT}/api/users/organizations/services/`,
  categoriesSetup: `${URLTOPOINT}/api/users/organizations/categories/`,
  deleteUser: `${URLTOPOINT}/api/users/`,
};
