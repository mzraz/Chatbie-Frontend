import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "@history";
import ContactModel from "../model/UserModel";
import { deleteUser } from "src/configurationKeys";
import { AiOutlineConsoleSql } from "react-icons/ai";
// import { updateUserSettings } from "app/store/userSlice";

export const getContact = createAsyncThunk(
  "contactsApp/contacts/getContact",
  async (params, thunkAPI) => {
    try {
      const accessToken = window.localStorage.getItem("jwt_access_token");
      const requestBody = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // body: JSON.stringify({
          //   role: role,
          // }),
        },
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/${params}`,
        requestBody
      ).then((data) => data.json());
      let updatedData = res.data;
      if (res?.assigned?.data) {
        updatedData = {
          ...updatedData,
          assign: [...res?.assigned?.data],
        };
      } else {
        updatedData = {
          ...updatedData,
          assign: [],
        };
      }

      if (res?.providerSchedule) {
        updatedData = {
          ...updatedData,
          scheduleBody: [...res?.providerSchedule],
        };
      }

      const data = updatedData;
      return data;
    } catch (error) {
      history.push({ pathname: `/users` });
      return null;
    }
  }
);

export const updateContact = createAsyncThunk(
  "contactsApp/contacts/updateContact",
  async (contact) => {
    const updatedData = {
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone_number: contact.phone_number,
      mobile_number: contact.mobile_number,
      address: contact.address,
      city: contact.city,
      state: contact.state,
      zip_code: contact.zip_code,
      user_name: contact.user_name,
      time_zone: contact.time_zone,
      calendar: contact.calendar,
      notes: contact.notes,
      assign: contact.assign,
      scheduleBody: contact.scheduleBody,
    };

    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    };
    const response = await fetch(
      `${deleteUser}${contact.id}`,
      requestBody
    ).then((data) => data.json());

    if (response?.error) {
      const data = response;
      return data;
    } else {
      const data = response?.data;
      return data;
    }
  }
);

export const removeContact = createAsyncThunk(
  "contactsApp/contacts/removeContact",
  async (id, thunkAPI) => {
    const accessToken = window.localStorage.getItem("jwt_access_token");

    const requestBody = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fetch(`${deleteUser}${id}`, requestBody).then((data) =>
      data.json()
    );

    if (res.error) {
      return res;
    } else {
      return id;
    }
  }
);

export const selectContact = ({ contactsApp }) => contactsApp.contact;

const contactSlice = createSlice({
  name: "contactsApp/contact",
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
