import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signUpSA } from "src/configurationKeys";

export const signUpUserAdmin = createAsyncThunk(
  "superAdmin/signUp",
  async (data) => {
    const updatedData = {
      ...data,
      role: "SuperAdmin",
    };
    const requestBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    };
    const res = await fetch(signUpSA, requestBody).then((data) => data.json());
    return res;
  }
);

const initialState = {
  userName: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const signUpSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {},
  extraReducers: {
    [signUpUserAdmin.fulfilled]: (state, payload) => {
      state.entities = payload.actions;
    },
  },
});

export const { postReducer } = signUpSlice;
export const { reset } = signUpSlice.actions;

export default signUpSlice.reducer;
