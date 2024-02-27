import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FuseUtils from "@fuse/utils";
import { setupKey } from "src/configurationKeys";

export const getCategory = createAsyncThunk(
  "servicesCategories/category/getCategory",
  async (productId) => {
    const response = await axios.get(`${setupKey}categories/${productId}`);
    const data = await response.data.data;

    return data === undefined ? null : data;
  }
);

export const removeCategory = createAsyncThunk(
  "servicesCategories/category/removeCategory",
  async (productData, { dispatch, getState }) => {
    const data = await axios.delete(`${setupKey}categories/${productData.id}`);
    return productData.id;
  }
);

export const createAndUpdateCategory = createAsyncThunk(
  "servicesCategories/category/createAndUpdateCategory",
  async (productData, thunkAPI) => {
    const updatedProductData = {
      name: productData.name,
      description: productData.description,
    };
    var user = thunkAPI.getState().user;
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: productData.id == "" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedProductData),
    };

    if (productData.id === "") {
      const res = await fetch(
        `${setupKey}${user?.selectedOrganization?.id}/categories`,
        requestBody
      ).then((data) => data.json());
      const data = res;
      return data;
    } else {
      const res = await fetch(
        `${setupKey}categories/${productData.id}`,
        requestBody
      ).then((data) => data.json());
      const data = res;
      return data;
    }
  }
);

const productSlice = createSlice({
  name: "servicesCategories/category",
  initialState: null,
  reducers: {
    resetProduct: () => null,
    newProduct: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          name: "",
          description: "",
          id: "",
          active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getCategory.fulfilled]: (state, action) => action.payload,
    [createAndUpdateCategory.fulfilled]: (state, action) => action.payload,
    [removeCategory.fulfilled]: (state, action) => null,
  },
});

export const { newProduct, resetProduct } = productSlice.actions;

export const selectProduct = ({ servicesCategories }) =>
  servicesCategories.category;

export default productSlice.reducer;
