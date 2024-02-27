import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FuseUtils from "@fuse/utils";
import { setupKey } from "src/configurationKeys";

export const getService = createAsyncThunk(
  "servicesAndCategories/service/getService",
  async (serviceId, thunkAPI) => {
    const response = await axios.get(`${setupKey}services/${serviceId}`);
    const data = await response.data.data;

    return data === undefined ? null : data;
  }
);

export const removeService = createAsyncThunk(
  "servicesAndCategories/service/removeService",
  async (productData, { dispatch, getState }) => {
    const res = await axios.delete(`${setupKey}services/${productData.id}`);
    return productData.id;
  }
);

export const createAndUpdateService = createAsyncThunk(
  "servicesAndCategories/service/createAndUpdateService",
  async (productData, thunkAPI) => {
    const { id, ...updatedData } = productData;
    var user = thunkAPI.getState().user;
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: productData.id === "" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    };
    if (productData.id === "") {
      const res = await fetch(
        `${setupKey}${user?.selectedOrganization?.id}/services`,
        requestBody
      ).then((data) => data.json());
      const data = res;

      return data;
    } else {
      const res = await fetch(
        `${setupKey}services/${productData.id}`,
        requestBody
      ).then((data) => data.json());
      const data = res;
      return data;
    }
  }
);

const serviceSlice = createSlice({
  name: "servicesAndCategories/service",
  initialState: null,
  reducers: {
    resetProduct: () => null,
    newProduct: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          name: "",
          duration: 30,
          price: 0,
          currencies: "",
          category_id: "",
          availabilities_type: "",
          attendant_number: 1,
          location: "",
          description: "",
          id: "",
        },
      }),
    },
  },
  extraReducers: {
    [getService.fulfilled]: (state, action) => action.payload,
    [createAndUpdateService.fulfilled]: (state, action) => action.payload,
    [removeService.fulfilled]: (state, action) => null,
  },
});

export const { newProduct, resetProduct } = serviceSlice.actions;

export const selectService = ({ servicesAndCategories }) =>
  servicesAndCategories.service;

export default serviceSlice.reducer;
