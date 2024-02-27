/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
import { setInitialSettings } from "app/store/fuse/settingsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";
import jwtService from "../auth/services/jwtService";
import { setupKey } from "src/configurationKeys";

export const setUser = createAsyncThunk(
  "user/setUser",
  async (user, { dispatch, getState }) => {
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    var res;
    var finalUpdatedData;
    if (!user.id) {
      res = await fetch(`${setupKey}userInformation`, requestBody).then(
        (data) => data.json()
      );

      if (res?.organizations?.length !== 0) {
        finalUpdatedData = {
          ...user,
          ...res,
          selectedOrganization: res?.organizations[0],
        };

        localStorage.setItem(
          "jwt_organization_id",
          finalUpdatedData.selectedOrganization.id
        );
      } else {
        finalUpdatedData = {
          ...user,
          ...res,
        };
      }
    } else {
      res = await fetch(
        `${setupKey}${user.id}/userInformation`,
        requestBody
      ).then((data) => data.json());
      const findOrganizationData = res.organizations.find(
        (item) => item.id === user.id
      );
      finalUpdatedData = {
        ...user,
        ...res,
        selectedOrganization: findOrganizationData,
      };
      localStorage.setItem(
        "jwt_organization_id",
        finalUpdatedData.selectedOrganization.id
      );
    }
    if (finalUpdatedData.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = finalUpdatedData.loginRedirectUrl;
    }
    return finalUpdatedData;
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { dispatch, getState }) => {
    const newUser = settings;
    dispatch(updateUserData(settings));
    return newUser;
  }
);

export const updateUserInfoAboutOrganization = createAsyncThunk(
  "user/updateUserInfoOrganizaiton",
  async (data, thunkAPI) => {
    var user = thunkAPI.getState().user;

    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(setupKey, requestBody).then((data) => data.json());
    if (res.error) {
      return res;
    } else {
      user = {
        ...user,
        organizations: [...res?.data],
      };

      return user;
    }
  }
);

export const updateUserShortcuts = createAsyncThunk(
  "user/updateShortucts",
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    return null;
  }

  history.push({
    pathname: "/",
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: "User data saved with api" }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [],
  data: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
    [setupKey.fulfilled]: (state, action) => action.payload,
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
