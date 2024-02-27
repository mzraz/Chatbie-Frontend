import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import formatISO from "date-fns/formatISO";
import { selectSelectedLabels } from "./labelsSlice";
import { setupKey } from "src/configurationKeys";
import { NetworkCell } from "@mui/icons-material";
export const dateFormat = "YYYY-MM-DDTHH:mm:ss.sssZ";

export const getEvents = createAsyncThunk(
  "calendarApp/events/getEvents",
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
    var response = await fetch(
      `${setupKey}${user?.selectedOrganization?.id}/appointments`,
      requestBody
    ).then((data) => data.json());

    const data = response.data;
    const transformedData = data.map((transformItem) => ({
      allDay: false,
      end: transformItem.ending_date,
      extendedProps: {
        desc: "",
        label: transformItem.label,
        customer_id: transformItem?.customer_id,
        provider_id: transformItem?.provider_id,
        service_id: transformItem?.service_id,
      },
      id: transformItem.id,
      start: transformItem.starting_date,
      title: transformItem.title,
    }));

    return transformedData;
  }
);

export const addEvent = createAsyncThunk(
  "calendarApp/events/addEvent",
  async (newEvent, { dispatch }) => {
    const updatedData = {
      first_name: newEvent.customerBody.first_name,
      last_name: newEvent.customerBody.last_name,
      phone_number: newEvent.customerBody.phone_number,
      email: newEvent.customerBody.email,
      city: newEvent.customerBody.city,
      zip_code: newEvent.customerBody.zip_code,
      notes: newEvent.customerBody.notes,
      time_zone: newEvent.customerBody.time_zone,
      language: newEvent.customerBody.language,
    };
    const updatedAppointmentBody = {
      provider_id: newEvent.appointmentBody.provider_id,
      service_id: newEvent.appointmentBody.service_id,
      starting_date: newEvent.appointmentBody.starting_date,
      ending_date: newEvent.appointmentBody.ending_date,
      title: newEvent.appointmentBody.title,
      label: newEvent.appointmentBody.label,
    };
    const data = {
      appointmentBody: {
        ...updatedAppointmentBody,
      },
      customerBody: {
        ...updatedData,
      },
    };

    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };

    var response = await fetch(
      `${setupKey}appointments/${newEvent.customerBody.id}`,
      requestBody
    ).then((data) => data.json());
    if (!response?.error) {
      const updatedData = {
        allDay: false,
        end: response.newAppointment.ending_date,
        extendedProps: {
          desc: response?.newAppointment?.notes,
          label: response?.newAppointment?.label,
          customer_id: response?.newAppointment?.customer_id,
          provider_id: response?.newAppointment?.provider_id,
          service_id: response?.newAppointment?.service_id,
        },
        id: response?.newAppointment?.id,
        start: response?.newAppointment?.starting_date,
        title: response?.newAppointment?.title,
      };

      return updatedData;
    } else {
      const data = [response];
      return data;
    }
  }
);

export const updateEvent = createAsyncThunk(
  "calendarApp/events/updateEvent",
  async (event, { dispatch }) => {
    const updatedDataObject = {
      service_id: event.appointmentBody.service_id,
      // customer_id: event?.customerBody?.id,
      provider_id: event?.appointmentBody?.provider_id,
      ending_date: event?.appointmentBody?.ending_date,
      starting_date: event?.appointmentBody?.starting_date,
      title: event.appointmentBody.title,
      // label: event.appointmentBody.label,
    };

    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedDataObject),
    };
    var response = await fetch(
      `${setupKey}appointments/${event?.appointmentBody?.id}`,
      requestBody
    ).then((data) => data.json());
    if (!response?.error) {
      const updatedData = {
        allDay: false,
        end: response.data.ending_date,
        extendedProps: {
          desc: response?.data?.notes,
          label: response?.data?.label,
          customer_id: response?.data?.customer_id,
          provider_id: response?.data?.provider_id,
          service_id: response?.data?.service_id,
        },
        id: response?.data?.id,
        start: response?.data?.starting_date,
        title: response?.data?.title,
      };

      return updatedData;
    } else {
      return response;
    }
  }
);

export const removeEvent = createAsyncThunk(
  "calendarApp/events/removeEvent",
  async (eventId, { dispatch }) => {
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    var response = await fetch(
      `${setupKey}appointments/${eventId}`,
      requestBody
    ).then((data) => data.json());

    return eventId;
  }
);

const eventsAdapter = createEntityAdapter({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = eventsAdapter.getSelectors((state) => state.calendarApp.events);

const eventsSlice = createSlice({
  name: "calendarApp/events",
  initialState: eventsAdapter.getInitialState({
    eventDialog: {
      type: "new",
      props: {
        open: false,
        anchorPosition: { top: 200, left: 400 },
      },
      data: null,
    },
  }),
  reducers: {
    openNewEventDialog: {
      prepare: (selectInfo) => {
        const { start, end, jsEvent } = selectInfo;
        const payload = {
          type: "new",
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      prepare: (clickInfo) => {
        const { jsEvent, event } = clickInfo;
        const { id, title, allDay, start, end, extendedProps } = event;

        const payload = {
          type: "edit",
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            id,
            title,
            allDay,
            extendedProps,
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    closeNewEventDialog: (state, action) => {
      state.eventDialog = {
        type: "new",
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
    closeEditEventDialog: (state, action) => {
      state.eventDialog = {
        type: "edit",
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: eventsAdapter.setAll,
    [addEvent.fulfilled]: eventsAdapter.addOne,
    [updateEvent.fulfilled]: eventsAdapter.upsertOne,
    [removeEvent.fulfilled]: eventsAdapter.removeOne,
  },
});

export const {
  openNewEventDialog,
  closeNewEventDialog,
  openEditEventDialog,
  closeEditEventDialog,
} = eventsSlice.actions;

export const selectFilteredEvents = createSelector(
  [selectSelectedLabels, selectEvents],

  (selectedLabels, events) => {
    return events?.filter((item) =>
      selectedLabels?.includes(item?.extendedProps?.label)
    );
  }
);

export const selectEventDialog = ({ calendarApp }) =>
  calendarApp.events.eventDialog;

export default eventsSlice.reducer;
