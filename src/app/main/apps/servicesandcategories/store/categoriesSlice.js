import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { setupKey } from "src/configurationKeys";

export const getCategories = createAsyncThunk(
  "servicesCategories/categories/getCategories",
  async (params, thunkAPI) => {
    var user = thunkAPI.getState().user;
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(
      `${setupKey}${user?.selectedOrganization?.id}/categories`,
      requestBody
    ).then((data) => data.json());

    const data = response.data;

    return data;
  }
);

export const removeCategories = createAsyncThunk(
  "servicesCategories/categories",
  async (productIds, { dispatch, getState }) => {
    return productIds;
  }
);

const productsAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } =
  productsAdapter.getSelectors((state) => state.servicesCategories.categories);

const productsSlice = createSlice({
  name: "servicesCategories/categories",
  initialState: productsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setProductsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getCategories.fulfilled]: productsAdapter.setAll,
    [removeCategories.fulfilled]: (state, action) =>
      productsAdapter.removeMany(state, action.payload),
  },
});

export const { setProductsSearchText } = productsSlice.actions;

export const selectProductsSearchText = ({ servicesCategories }) =>
  servicesCategories.categories.searchText;

export const selectCategories = ({ servicesCategories }) =>
  servicesCategories.categories;
export default productsSlice.reducer;
