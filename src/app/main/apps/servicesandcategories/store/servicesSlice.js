import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { setupKey } from "src/configurationKeys";
export const getServices = createAsyncThunk(
  "servicesAndCategories/services/getServices",
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
      `${setupKey}${user?.selectedOrganization?.id}/services`,
      requestBody
    ).then((data) => data.json());

    if (response?.data) {
      const data = response?.data;
      return data;
    } else {
      const data = response.services;
      return data;
    }
  }
);
export const removeServices = createAsyncThunk(
  "servicesAndCategories/services",
  async (productIds, { dispatch, getState }) => {
    await axios.delete("/api/ecommerce/services", { data: productIds });

    return productIds;
  }
);

const servicesAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } =
  servicesAdapter.getSelectors((state) => state.servicesAndCategories.services);

const servicesSlice = createSlice({
  name: "servicesAndCategories/services",
  initialState: servicesAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setServicesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || "" }),
    },
  },
  extraReducers: {
    [getServices.fulfilled]: servicesAdapter.setAll,
    [removeServices.fulfilled]: (state, action) =>
      servicesAdapter.removeMany(state, action.payload),
  },
});

export const { setServicesSearchText } = servicesSlice.actions;

export const selectServicesSearchText = ({ servicesAndCategories }) =>
  servicesAndCategories.services.searchText;

export const selectServices = ({ servicesAndCategories }) =>
  servicesAndCategories.services;
export default servicesSlice.reducer;
