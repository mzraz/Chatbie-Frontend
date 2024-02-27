import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FuseUtils from "@fuse/utils/FuseUtils";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";

import dayjs from "dayjs";
import { FormHelperText } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import * as yup from "yup";
import _ from "@lodash";
import { useNavigate } from "react-router-dom";
import { Popover } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import moment from "moment";
import {
  addEvent,
  closeEditEventDialog,
  closeNewEventDialog,
  removeEvent,
  selectEventDialog,
  updateEvent,
} from "../../store/eventsSlice";
import EventModel from "../../model/EventModel";
import { selectFirstLabelId } from "../../store/labelsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import { BiInfoCircle } from "react-icons/bi";
import { setupKey } from "src/configurationKeys";

const defaultValues = EventModel();

const schema = yup.object().shape({
  title: yup.string().required("You must enter a title"),
});
import { getAllTimezones } from "countries-and-timezones";

const time_zone = getAllTimezones();

function EventDialog(props) {
  const { userAllData } = props;
  const dispatch = useDispatch();
  const eventDialog = useSelector(selectEventDialog);
  const firstLabelId = useSelector(selectFirstLabelId);
  const navigate = useNavigate();
  const [providersAssociation, setProvidersAssociation] = useState([]);
  const [providerScheduleDetail, setProviderScheduleDetail] = useState([]);
  const [dayScheduleData, setDayScheduleData] = useState([]);

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [error, setError] = useState({
    provider_id: "",
    service_id: "",
    starting_date: "",
    ending_date: "",
    title: "",
    id: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    time_zone: "",
    language: "",
    zip_code: "",
  });
  const [appointmentBody, setAppointmentBody] = useState({
    provider_id: "",
    service_id: "",
    starting_date: "",
    ending_date: "",
    title: "",
    id: "",
    label: "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc",
  });
  const [appointmentTime, setAppointmentTime] = useState({
    starting_date: new Date(),
    ending_date: new Date(),
  });
  const [customerBody, setCustomerBody] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    city: "",
    zip_code: "",
    notes: "",
    time_zone: "",
    language: "",
    id: "",
  });
  const [customerFormOpen, setCustomerForm] = useState(true);
  const [existingCustomers, setExistingCustomers] = useState([]);

  const data = Object.values(time_zone);
  const CustomersDataHandle = () => {
    setExistingCustomers([...userAllData?.customers]);
    setCustomerForm(false);
  };

  const { reset, formState } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const languages = [
    "English",
    "Arabic",
    "bulgarian",
    "Catalan",
    "Chinese",
    "Czech",
    "Danish",
    "Dutch",
    "finnish",
    "French",
    "German",
    "Greek",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Italian",
    "Japenese",
    "Marathi",
    "Persian",
    "Polish",
    "Portuguese",
    "Portuguese-br",
    "Romanian",
    "Russian",
    "Slovak",
    "Spanish",
    "Turkish",
  ];

  const initDialog = useCallback(() => {
    if (eventDialog.type === "edit" && eventDialog?.data?.id) {
      // reset({ ...eventDialog.data });
      const customerDataToUpdate = userAllData?.customers?.find(
        (item) => item.id === eventDialog?.data?.extendedProps?.customer_id
      );
      const providerDetailsNeedToUpdate = userAllData?.providers?.find(
        (item) => item.id === eventDialog?.data?.extendedProps?.provider_id
      );
      const ServiceDetailsNeedToUpdate = userAllData?.services?.find(
        (item) => item.id === eventDialog?.data?.extendedProps?.service_id
      );
      filteredProviders(ServiceDetailsNeedToUpdate.name);

      setCustomerBody({
        first_name: customerDataToUpdate?.first_name,
        last_name: customerDataToUpdate?.last_name,
        phone_number: customerDataToUpdate?.phone_number,
        email: customerDataToUpdate?.email,
        city: customerDataToUpdate?.city,
        zip_code: customerDataToUpdate?.zip_code,
        notes: customerDataToUpdate?.notes,
        time_zone: customerDataToUpdate?.time_zone,
        language: customerDataToUpdate?.language,
        id: customerDataToUpdate?.id,
      });

      const startingPointToUpdate = new Date(eventDialog?.data?.start);
      const endPointToUpdate = new Date(eventDialog?.data?.end);

      const defaultStartingDate = dayjs(eventDialog?.data?.start).format(
        "MM/DD/YYYY hh:mm A"
      );
      const defaultEndDate = dayjs(eventDialog?.data?.end).format(
        "MM/DD/YYYY hh:mm A"
      );
      setAppointmentTime({
        starting_date: startingPointToUpdate,
        ending_date: endPointToUpdate,
      });
      setAppointmentBody({
        provider_id: providerDetailsNeedToUpdate?.user_name,
        service_id: ServiceDetailsNeedToUpdate?.name,
        starting_date: defaultStartingDate,
        ending_date: defaultEndDate,
        title: eventDialog?.data?.title,
        id: eventDialog?.data?.id,
        label: "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc",
      });
      setCustomerForm(true);
    } else {
      const defaultStartingDate = dayjs(eventDialog?.data?.start).format(
        "MM/DD/YYYY hh:mm A"
      );
      const defaultEndDate = dayjs(eventDialog?.data?.end).format(
        "MM/DD/YYYY hh:mm A"
      );

      const startingPointToUpdate = new Date(eventDialog?.data?.start);
      const endPointToUpdate = new Date(eventDialog?.data?.end);
      setAppointmentTime({
        starting_date: startingPointToUpdate,
        ending_date: endPointToUpdate,
      });

      setAppointmentBody({
        provider_id: "",
        service_id: "",
        starting_date: defaultStartingDate,
        ending_date: defaultEndDate,
        title: "",
        id: "",
        label: "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc",
      });
    }

    if (eventDialog.type === "new") {
      reset({
        ...defaultValues,
        ...eventDialog.data,
        extendedProps: {
          ...defaultValues.extendedProps,
          label: firstLabelId,
        },
        id: FuseUtils.generateGUID(),
      });
    }
  }, [eventDialog.data, eventDialog.type, reset]);

  useEffect(() => {
    if (eventDialog.props.open) {
      initDialog();
    }
  }, [eventDialog.props.open, initDialog]);

  function closeComposeDialog() {
    setCustomerBody({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      city: "",
      zip_code: "",
      notes: "",
      time_zone: "",
      language: "",
      id: "",
    });

    setError({
      provider_id: "",
      service_id: "",
      starting_date: "",
      ending_date: "",
      title: "",
      id: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      time_zone: "",
      language: "",
      zip_code: "",
    });
    setAppointmentBody({
      provider_id: "",
      service_id: "",
      starting_date: "",
      ending_date: "",
      title: "",
      id: "",
      label: "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc",
    });
    setCustomerForm(true);
    setProvidersAssociation([]);
    return eventDialog.type === "edit"
      ? dispatch(closeEditEventDialog())
      : dispatch(closeNewEventDialog());
  }

  function onSubmit(ev) {
    ev.preventDefault();

    const findServiceID = userAllData.services.find(
      (item) => item.name === appointmentBody.service_id
    );
    const findProviderID = userAllData.providers.find(
      (item) => item.user_name === appointmentBody.provider_id
    );
    const defaultStartingDate = dayjs(appointmentBody.starting_date).format(
      "MM/DD/YYYY hh:mm A"
    );
    const defaultEndingDate = dayjs(appointmentBody.ending_date).format(
      "MM/DD/YYYY hh:mm A"
    );

    const updatedAppointmentBody = {
      ...appointmentBody,
      service_id: findServiceID?.id,
      provider_id: findProviderID?.id,
      starting_date: defaultStartingDate,
      ending_date: defaultEndingDate,
    };

    const data = {
      appointmentBody: {
        ...updatedAppointmentBody,
      },
      customerBody: {
        ...customerBody,
      },
    };
    if (eventDialog.type === "new") {
      dispatch(addEvent(data)).then((res) => {
        if (!res?.payload[0]?.error && res?.payload !== undefined) {
          dispatch(
            showMessage({
              message: "Appointment created successfully.",
              variant: "success",
            })
          );
          closeComposeDialog();
          navigate("/appointments/");
        } else if (typeof res?.payload[0]?.error === "object") {
          setError({
            ...res?.payload[0]?.error,
          });
        } else {
          dispatch(
            showMessage({
              message: res?.payload[0]?.error,
              variant: "error",
            })
          );
        }
      });
    }
    if (eventDialog.type === "edit") {
      dispatch(updateEvent(data)).then((res) => {
        if (!res?.payload[0]?.error && res?.payload !== undefined) {
          dispatch(
            showMessage({
              message: "Appointment updated successfully.",
              variant: "success",
            })
          );
          closeComposeDialog();
          navigate("/appointments/");
        } else if (typeof res?.payload[0]?.error === "object") {
          setError({
            ...res?.payload[0]?.error,
          });
        } else {
          dispatch(
            showMessage({
              message: res?.payload[0]?.error,
              variant: "error",
            })
          );
        }
      });
    }
  }

  const handleCustomerDataChange = (e) => {
    const { name, value } = e.target;
    setCustomerBody((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAppointmentDataChange = (e) => {
    const { name, value } = e.target;
    setAppointmentBody((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "service_id") {
      filteredProviders(e.target.value);
    }

    if (name === "provider_id") {
      providerFreeScheduleDetail(e.target.value);
    }
  };

  const filteredProviders = (name) => {
    const selectedServiceData = userAllData?.services?.find(
      (item) => item.name === name
    );

    const serviceIdToFind = selectedServiceData.id;
    const providersArray = userAllData?.providers;
    const assignedServicesArray = userAllData?.assignedServices;

    const selectedProviders = [];
    for (const assignedService of assignedServicesArray) {
      if (
        assignedService.provider_services &&
        assignedService.provider_services.length > 0
      ) {
        const matchingProviderService = assignedService.provider_services.find(
          (providerService) => providerService.service_id === serviceIdToFind
        );

        if (matchingProviderService) {
          const providerId = assignedService.id;
          const matchingProvider = providersArray.find(
            (provider) => provider.id === providerId
          );

          if (matchingProvider) {
            selectedProviders.push(matchingProvider);
          }
        }
      }
    }

    setProvidersAssociation([...selectedProviders]);
  };

  const providerFreeScheduleDetail = async (name) => {
    const providerData = userAllData?.providers?.find(
      (item) => item.user_name === name
    );
    const accessToken = window.localStorage.getItem("jwt_access_token");
    const requestBody = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await fetch(
      `${setupKey}providerAvalibility/${providerData.id}`,
      requestBody
    ).then((data) => data.json());

    console.log(response.slots);
    setProviderScheduleDetail([...Object.entries(response.slots)]);
  };

  const selectCustomerData = (e) => {
    const findCustomer = userAllData?.customers?.find(
      (item) => item.email === e.target.value
    );
    setCustomerBody({
      first_name: findCustomer.first_name,
      last_name: findCustomer.last_name,
      phone_number: findCustomer.phone_number,
      email: findCustomer.email,
      city: findCustomer.city,
      zip_code: findCustomer.zip_code,
      notes: findCustomer.notes,
      time_zone: findCustomer.time_zone,
      language: findCustomer.language,
      id: findCustomer.id,
    });

    setCustomerForm(true);
    setExistingCustomers([]);
  };

  const handleDateTimeStartingPoint = (e) => {
    const defaultDate = dayjs(e).format("MM/DD/YYYY hh:mm A");
    setAppointmentBody((prevData) => ({
      ...prevData,
      starting_date: defaultDate,
    }));
  };
  const handleDateTimeEndingPoint = (e) => {
    const defaultDate = dayjs(e).format("MM/DD/YYYY hh:mm A");
    setAppointmentBody((prevData) => ({
      ...prevData,
      ending_date: defaultDate,
    }));
  };

  function handleRemove() {
    if (appointmentBody.id !== "") {
      dispatch(removeEvent(appointmentBody.id));
      closeComposeDialog();
    } else {
      dispatch(
        showMessage({
          message:
            "You cannot be able to delete anything during the creation of an appointment.",
          variant: "error",
        })
      );
    }
  }

  const customerForm = () => {
    setCustomerBody({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      city: "",
      zip_code: "",
      notes: "",
      time_zone: "",
      language: "",
      id: "",
    });
    setCustomerForm(true);
    setExistingCustomers([]);
  };

  const buttonText = appointmentBody?.id ? "Update" : "Add";

  const handleDayScheduleForProvider = (e) => {
    let day = e.target.value;
    let data = providerScheduleDetail.find((item) => item[0] === day);
    console.log(data);
    let array = [];
    data[1]?.map((item) => {
      const startingPointToUpdate = moment
        .parseZone(item.starting_time)
        .format("MM/DD/YYYY hh:mm A");
      const endPointToUpdate = moment
        .parseZone(item.ending_time)
        .format("MM/DD/YYYY hh:mm A");
      const ss = new Date(startingPointToUpdate);
      const sss = new Date(endPointToUpdate);
      const getVisualsStartTime = moment
        .parseZone(item.starting_time)
        .format("h:mm A");
      const getVisualEndTime = moment
        .parseZone(item.ending_time)
        .format("h:mm A");
      const obj = {
        starting_time: ss,
        ending_time: sss,
        displayStartTime: getVisualsStartTime,
        displayEndTime: getVisualEndTime,
        start: item.starting_time,
        end: item.ending_time,
      };

      array = [...array, obj];
    });
    setDayScheduleData([...array]);
  };

  const handleTimeDisplay = (e) => {
    let timeData = e.target.value;
    console.log(timeData);
    setAppointmentTime({
      starting_date: timeData.starting_time,
      ending_date: timeData.ending_time,
    });

    setAppointmentBody({
      provider_id: appointmentBody.provider_id,
      service_id: appointmentBody.service_id,
      starting_date: timeData.starting_time,
      ending_date: timeData.ending_time,
      title: appointmentBody.title,
      id: appointmentBody.id,
      label: "1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc",
    });
  };
  return (
    <Popover
      {...eventDialog.props}
      anchorReference="anchorPosition"
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      onClose={closeComposeDialog}
      component="form"
    >
      <div className="flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-auto">
        <div className="flex sm:space-x-24 mb-16">
          <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
            heroicons-outline:pencil-alt
          </FuseSvgIcon>
          <h1>Appointment Details</h1>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Service*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Service"
              required
              name="service_id"
              value={appointmentBody.service_id}
              onChange={(e) => handleAppointmentDataChange(e)}
            >
              {userAllData?.services?.map((item) => (
                <MenuItem value={item.name}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Provider*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Provider"
              required
              disabled={providersAssociation.length === 0}
              value={appointmentBody.provider_id}
              onChange={(e) => handleAppointmentDataChange(e)}
              name="provider_id"
            >
              {providersAssociation.map((item) => (
                <MenuItem value={item.user_name}>{item.user_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id="title"
            label="Title"
            className="flex-auto"
            name="title"
            error={!!error.title}
            helperText={error.title}
            value={appointmentBody.title}
            onChange={(e) => handleAppointmentDataChange(e)}
            variant="outlined"
            fullWidth
          />
        </div>

        <div className="flex sm:space-x-24 mb-16">
          <FuseSvgIcon className="hidden sm:inline-flex mt-16" color="action">
            heroicons-outline:calendar
          </FuseSvgIcon>
          <div className="w-full">
            <div className="flex flex-column sm:flex-row w-full items-center space-x-16">
              <DesktopDateTimePicker
                name="starting_date"
                value={appointmentTime?.starting_date}
                onChange={(e) => handleDateTimeStartingPoint(e)}
              />
              <DesktopDateTimePicker
                value={appointmentTime?.ending_date}
                name="ending_date"
                onChange={(e) => handleDateTimeEndingPoint(e)}
              />
            </div>
          </div>
        </div>
        {providerScheduleDetail.length !== 0 ? (
          <>
            <h1>Provider Schedule Details</h1>
            <div className="flex sm:space-x-24 mb-16">
              <BiInfoCircle
                size={30}
                className="hidden sm:inline-flex mt-32 opacity-70"
              />
              <div className="w-full">
                <div className="flex flex-column sm:flex-row w-full items-center space-x-16">
                  <FormControl fullWidth className="mt-32">
                    <InputLabel id="demo-simple-select-label">
                      Select Day
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Select Day"
                      onChange={(e) => handleDayScheduleForProvider(e)}
                    >
                      {weekDays?.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth className="mt-32">
                    <InputLabel id="demo-simple-select-label">
                      Time Availabilities
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      disabled={dayScheduleData.length === 0}
                      label="Time Availabilities"
                      onChange={(e) => handleTimeDisplay(e)}
                    >
                      {dayScheduleData?.map((item) => (
                        <MenuItem value={item}>
                          {item.displayStartTime}-{item.displayEndTime}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <h1>Customer Details</h1>
        {eventDialog.type === "edit" ? null : (
          <div className="flex flex-row items-center space-x-8">
            <div>
              <div className="" />
              {eventDialog.type === "edit" ? null : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => customerForm()}
                >
                  New
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-8">
              <div className="" />
              {eventDialog.type === "edit" ? null : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => CustomersDataHandle()}
                >
                  Select
                </Button>
              )}
            </div>
          </div>
        )}
        {existingCustomers.length !== 0 ? (
          <FormControl fullWidth className="mt-32 mb-32">
            <InputLabel id="demo-simple-select-label">Customers</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Customers"
              required
              onChange={(e) => selectCustomerData(e)}
              name="selectCustomer"
            >
              {userAllData?.customers?.map((item) => (
                <MenuItem value={item.email}>
                  {item.first_name} {item.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div>{/* There are no existing Customers */}</div>
        )}

        {customerFormOpen === true ? (
          <div className="mt-32">
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                label="First Name"
                autoFocus
                error={!!error.first_name}
                helperText={error.first_name}
                className="flex-auto"
                name="first_name"
                disabled={customerBody?.id !== ""}
                onChange={(e) => handleCustomerDataChange(e)}
                value={customerBody.first_name}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                required
                fullWidth
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                label="Last Name"
                disabled={customerBody?.id !== ""}
                name="last_name"
                onChange={(e) => handleCustomerDataChange(e)}
                value={customerBody.last_name}
                className="flex-auto"
                error={!!error.last_name}
                helperText={error.last_name}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
                required
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                label="Email"
                name="email"
                disabled={customerBody?.id !== ""}
                className="flex-auto"
                error={!!error.email}
                helperText={error.email}
                value={customerBody.email}
                onChange={(e) => handleCustomerDataChange(e)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                required
                fullWidth
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                label="Phone Number"
                name="phone_number"
                disabled={customerBody?.id !== ""}
                value={customerBody.phone_number}
                onChange={(e) => handleCustomerDataChange(e)}
                className="flex-auto"
                error={!!error.phone_number}
                helperText={error.phone_number}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
                required
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                name="address"
                label="Address"
                disabled={customerBody?.id !== ""}
                value={customerBody.address}
                className="flex-auto"
                onChange={(e) => handleCustomerDataChange(e)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                label="City"
                name="city"
                disabled={customerBody?.id !== ""}
                value={customerBody.city}
                className="flex-auto"
                onChange={(e) => handleCustomerDataChange(e)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <FormControl fullWidth>
                <InputLabel id="demo-timezones">Timezones*</InputLabel>
                <Select
                  labelId="demo-timezones-select"
                  id="time_zone"
                  disabled={customerBody?.id !== ""}
                  label="Timezones*"
                  value={customerBody.time_zone}
                  error={!!error.time_zone}
                  helperText={error.time_zone}
                  name="time_zone"
                  required
                  onChange={(e) => handleCustomerDataChange(e)}
                  MenuProps={{
                    disablePortal: true,
                  }}
                >
                  {data.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {`${item.name} (${item.dstOffsetStr})`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  style={{
                    color: "#e74e3e",
                  }}
                >
                  {error.time_zone}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <FormControl fullWidth>
                <InputLabel id="demo-language">language*</InputLabel>
                <Select
                  labelId="demo-timezones-select"
                  id="language"
                  value={customerBody.language}
                  disabled={customerBody?.id !== ""}
                  label="language*"
                  name="language"
                  required
                  error={!!error.language}
                  helperText={error.language}
                  onChange={(e) => handleCustomerDataChange(e)}
                >
                  {languages.map((item) => (
                    <MenuItem value={item} key={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  style={{
                    color: "#e74e3e",
                  }}
                >
                  {error.language}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <TextField
                id="title"
                name="zip_code"
                label="Zip Code"
                disabled={customerBody?.id !== ""}
                className="flex-auto"
                value={customerBody.zip_code}
                onChange={(e) => handleCustomerDataChange(e)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="flex sm:space-x-24 mb-16">
              <FuseSvgIcon
                className="hidden sm:inline-flex mt-16"
                color="action"
              >
                heroicons-outline:menu-alt-2
              </FuseSvgIcon>

              <TextField
                className="mt-8 mb-16"
                id="desc"
                label="Notes"
                name="notes"
                disabled={customerBody?.id !== ""}
                value={customerBody.notes}
                onChange={(e) => handleCustomerDataChange(e)}
                type="text"
                multiline
                rows={5}
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {}
        {eventDialog.type === "new" ? (
          <div className="flex items-center space-x-8">
            <div className="flex flex-1" />
            {appointmentBody.provider_id && appointmentBody.service_id ? (
              <Button variant="contained" color="primary" onClick={onSubmit}>
                {buttonText}
              </Button>
            ) : (
              <Button
                disabled
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                {buttonText}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-8">
            <div className="flex flex-1" />
            <IconButton onClick={handleRemove} size="large">
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </IconButton>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </Popover>
  );
}

export default EventDialog;
