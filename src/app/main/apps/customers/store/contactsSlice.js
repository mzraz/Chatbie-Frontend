import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import FuseUtils from "@fuse/utils";
import { removeContact, updateContact } from "./userSlice";
import { setupKey } from "src/configurationKeys";

export const getContacts = createAsyncThunk(
  "customersApp/customers/getContacts",
  async (params, thunkAPI) => {
    const user = thunkAPI.getState().user;

    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await fetch(
      `${setupKey}${user?.selectedOrganization?.id}/customers`,
      requestBody
    ).then((data) => data.json());

    const data = res?.data;
    return { data };
  }
);
export const addContact = createAsyncThunk(
  "customersApp/customers/addContact",
  async (userData, thunkAPI) => {
    const user = thunkAPI.getState().user;

    const { id, ...userDataToUpdate } = userData;
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userDataToUpdate),
    };
    const res = await fetch(
      `${setupKey}${user?.selectedOrganization?.id}/customers`,
      requestBody
    ).then((data) => data.json());

    if (res?.error) {
      const data = res;
      return data;
    } else {
      const data = res?.data;
      return data;
    }
  }
);

const contactsAdapter = createEntityAdapter({});

export const selectSearchText = ({ customersApp }) =>
  customersApp.customers.searchText;

export const { selectAll: selectContacts, selectById: selectContactsById } =
  contactsAdapter.getSelectors((state) => state.customersApp.customers);

export const selectFilteredContacts = createSelector(
  [selectContacts, selectSearchText],
  (customers, searchText) => {
    if (searchText.length === 0) {
      return customers;
    }
    return FuseUtils.filterArrayByString(customers, searchText);
  }
);

export const selectGroupedFilteredContacts = createSelector(
  [selectFilteredContacts],
  (customers) => {
    const customer = customers.find((item) => item.status === "Failed");
    const customersUpdatedData = customers.filter(
      (item) => item.status !== "Failed"
    );
    if (customer) {
      return customersUpdatedData
        .sort((a, b) =>
          a?.first_name?.localeCompare(b?.first_name, "es", {
            sensitivity: "base",
          })
        )
        .reduce((r, e) => {
          const group = e.first_name[0];
          if (!r[group]) r[group] = { group, children: [e] };
          else r[group].children.push(e);
          return r;
        }, {});
    } else {
      return customers
        .sort((a, b) =>
          a?.first_name?.localeCompare(b?.first_name, "es", {
            sensitivity: "base",
          })
        )
        .reduce((r, e) => {
          const group = e.first_name[0];
          if (!r[group]) r[group] = { group, children: [e] };
          else r[group].children.push(e);
          return r;
        }, {});
    }
  }
);

const contactsSlice = createSlice({
  name: "customersApp/customers",
  initialState: contactsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [updateContact.fulfilled]: contactsAdapter.upsertOne,
    [addContact.fulfilled]: contactsAdapter.addOne,
    [removeContact.fulfilled]: (state, action) =>
      contactsAdapter.removeOne(state, action.payload),
    [getContacts.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      contactsAdapter.setAll(state, data);
      state.searchText = "";
    },
  },
});

export const { setContactsSearchText } = contactsSlice.actions;

export default contactsSlice.reducer;
