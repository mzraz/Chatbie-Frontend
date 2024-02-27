import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "@history";
import ContactModel from "../model/UserModel";
import { deleteUser, setupKey } from "src/configurationKeys";
// import { updateUserSettings } from "app/store/userSlice";

export const getContact = createAsyncThunk(
  "customersApp/task/getContact",
  async (id, thunkAPI) => {
    try {
      const accessToken = window.localStorage.getItem("jwt_access_token");

      const requestBody = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await fetch(`${setupKey}customers/${id}`, requestBody).then(
        (data) => data.json()
      );

      const data = res.data;
      return data;
    } catch (error) {
      history.push({ pathname: `/patients` });
      return null;
    }
  }
);

export const updateContact = createAsyncThunk(
  "customersApp/contacts/updateContact",
  async (contact, { dispatch, getState }) => {
    const accessToken = window.localStorage.getItem("jwt_access_token");

    const requestBody = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone_number: contact.phone_number,
        address: contact.address,
        city: contact.city,
        zip_code: contact.zip_code,
        time_zone: contact.time_zone,
        calendar: contact.calendar,
        notes: contact.notes,
        language: contact.language,
      }),
    };

    const res = await fetch(
      `${setupKey}customers/${contact.id}`,
      requestBody
    ).then((data) => data.json());

    if (res?.error) {
      const data = res;
      return data;
    } else {
      const data = res.data;
      return data;
    }
  }
);

export const removeContact = createAsyncThunk(
  "customersApp/contacts/removeContact",
  async (id, thunkAPI) => {
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(`${setupKey}customers/${id}`, requestBody).then(
      (data) => data.json()
    );

    if (res?.error) {
      return res.error;
    } else {
      return id;
    }
  }
);

export const selectContact = ({ customersApp }) => customersApp.contact;

const contactSlice = createSlice({
  name: "customersApp/contact",
  initialState: null,
  reducers: {
    newContact: (state, action) => ContactModel(),
    resetContact: () => null,
  },
  extraReducers: {
    [getContact.pending]: (state, action) => null,
    [getContact.fulfilled]: (state, action) => action.payload,
    [updateContact.fulfilled]: (state, action) => action.payload,
    [removeContact.fulfilled]: (state, action) => null,
  },
});

export const { resetContact, newContact } = contactSlice.actions;

export default contactSlice.reducer;
