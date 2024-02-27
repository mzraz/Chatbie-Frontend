import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import jwtServiceConfig from "./jwtServiceConfig";

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(jwtServiceConfig.signUp, data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
          this.emit("onLogin", response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = async (email, password) => {
    try {
      return await new Promise((resolve, reject) => {
        axios
          .post(jwtServiceConfig.signIn, {
            email,
            password,
          })
          .then((response) => {
            if (response.data.data) {
              this.setSession(response.data.accessToken);
              resolve(response.data);
              this.emit("onLogin", response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            reject(new Error("Invalid Credentials."));
          });
      });
    } catch (err) {}
  };

  setOrganizationData = (userData) => {
    return new Promise((resolve, reject) => {
      this.setSession(userData.accessToken);
      resolve(userData);
      this.emit("onLoginWithOrganization", userData);
    });
  };

  signInWithToken = () => {
    const org_id = localStorage.getItem("jwt_organization_id");
    return new Promise((resolve, reject) => {
      axios
        .get(jwtServiceConfig.accessToken)
        .then((response) => {
          const userData = { ...response.data, id: org_id };
          if (response.data.data) {
            localStorage.removeItem("jwt_organization_id");
            this.setSession(userData.accessToken);
            resolve(userData);
            this.emit("onLoginWithToken", userData);
          } else {
            this.logout();
            reject(new Error("Failed to login with token."));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    localStorage.removeItem("jwt_organization_id");
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
