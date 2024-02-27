import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import FuseUtils from "@fuse/utils";
import { removeContact, updateContact } from "./userSlice";
import { signUpSA, setupKey } from "src/configurationKeys";

export const getContacts = createAsyncThunk(
  "contactsApp/contacts/getContacts",
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
    var res = await fetch(
      `${setupKey}${user?.selectedOrganization?.id}/userInformation`,
      requestBody
    ).then((data) => data.json());
    if (res?.admins && res?.managers && res?.providers) {
      const data = [...res?.admins, ...res?.managers, ...res?.providers];
      return { data };
    } else if (res?.managers && res?.providers) {
      const data = [...res?.managers, ...res?.providers];
      return { data };
    } else {
      var providers = [];
      for (let i = 0; i < res?.assignedProviders?.data.length; i++) {
        let data = res?.assignedProviders?.data[i].provider_id;
        const findProvider = res?.providers?.find((item) => item.id === data);
        providers.push(findProvider);
      }

      const data = [...providers];
      return { data };
    }
  }
);
export const addContact = createAsyncThunk(
  "contactsApp/contacts/addContact",
  async (userData, thunkAPI) => {
    const { id, ...updatedData } = userData;
    var user = thunkAPI.getState().user;
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    };
    const res = await fetch(
      `${signUpSA}${user?.selectedOrganization?.id}`,
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

export const selectSearchText = ({ contactsApp }) =>
  contactsApp.contacts.searchText;

export const { selectAll: selectContacts, selectById: selectContactsById } =
  contactsAdapter.getSelectors((state) => state.contactsApp.contacts);

export const selectFilteredContacts = createSelector(
  [selectContacts, selectSearchText],
  (contacts, searchText) => {
    if (searchText.length === 0) {
      return contacts;
    }
    return FuseUtils.filterArrayByString(contacts, searchText);
  }
);

export const selectGroupedFilteredContacts = createSelector(
  [selectFilteredContacts],
  (contacts) => {
    const contact = contacts.find((item) => item.status === "Failed");
    const contactsUpdatedData = contacts.filter(
      (item) => item.status !== "Failed"
    );
    if (contact) {
      return contactsUpdatedData
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
      return contacts
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
  name: "contactsApp/contacts",
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
