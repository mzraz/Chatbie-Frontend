import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { showMessage } from "app/store/fuse/messageSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "app/store/userSlice";
import _ from "@lodash";
import { styled } from "@mui/material/styles";
import { selectContact } from "../store/userSlice";
import { addContact, selectFilteredContacts } from "../store/contactsSlice";
import { updateContact } from "../store/userSlice";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  OutlinedInput,
} from "@mui/material";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { tableCellClasses } from "@mui/material/TableCell";

import { getAllTimezones } from "countries-and-timezones";

import { RiLockPasswordLine } from "react-icons/ri";
import { setupKey } from "src/configurationKeys";
import { useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor:
      personName.indexOf(name) !== -1 ? "#3c76d2" : "transparent",
    color: personName.indexOf(name) !== -1 ? "white" : "inherit",
  };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(dayName, start, end) {
  return { dayName, start, end };
}

const time_zone = getAllTimezones();

function ContactForm(props) {
  const theme = useTheme();
  const [adminForm, setAdminForm] = useState(false);
  const [secretariesForm, setSecretariesForm] = useState(false);
  const [providerForm, setProviderForm] = useState(false);
  const [details, setDetails] = useState(true);
  const [workingPlan, setWorkingPlan] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const [addonsData, setAddonsData] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  // const [providersDetailPlan, setProvidersDetailPlan] = useState([
  //   {
  //     day_of_week: "Sunday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "6:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "2:00 PM",
  //   },
  //   {
  //     day_of_week: "Monday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "8:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "3:00 PM",
  //   },
  //   {
  //     day_of_week: "Tuesday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "8:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "3:00 PM",
  //   },
  //   {
  //     day_of_week: "Wednesday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "8:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "3:00 PM",
  //   },
  //   {
  //     day_of_week: "Thursday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "8:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "3:00 PM",
  //   },
  //   {
  //     day_of_week: "Friday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "8:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "3:00 PM",
  //   },
  //   {
  //     day_of_week: "Saturday",
  //     work_start_time: "9:00 AM",
  //     work_end_time: "8:00 PM",
  //     break_start_time: "1:00 PM",
  //     break_end_time: "3:00 PM",
  //   },
  // ]);
  const filteredData = useSelector(selectFilteredContacts);
  const user = useSelector(selectUser);

  var failedItem = filteredData?.find((item) => item?.status === "Failed");
  var providersDataArray;
  if (failedItem) {
    const filterArrayForProviders = filteredData.filter(
      (item) => item?.status !== "Failed"
    );
    providersDataArray = filterArrayForProviders.filter(
      (item) => item?.user_roles[0]?.role_name === "Provider"
    );
  } else {
    providersDataArray = filteredData.filter(
      (item) => item?.user_roles[0]?.role_name === "Provider"
    );
  }

  const navigate = useNavigate();
  const data = Object.values(time_zone);
  const allUsersData = useSelector(selectContact);

  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    if (showPassword === true) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };
  const handleClickShowPasswordConfirmation = () => {
    if (showPasswordConfirmation === true) {
      setShowPasswordConfirmation(false);
    } else {
      setShowPasswordConfirmation(true);
    }
  };

  useEffect(() => {
    async function getServices() {
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
      setServicesData([...response.services]);

      const res = await fetch(
        `${setupKey}${user?.selectedOrganization?.id}/userInformation`,
        requestBody
      ).then((data) => data.json());
      setProvidersData([...res.providers]);
    }

    getServices();
  }, []);

  useEffect(() => {
    if (
      allUsersData?.user_roles[0]?.role_name === "Manager" &&
      allUsersData?.assign?.length !== 0
    ) {
      if (providersData.length > 0) {
        let data = [];
        for (let i = 0; i < allUsersData?.assign?.length; i++) {
          const findData = providersData?.find(
            (item) => item?.id === allUsersData?.assign[i]?.provider_id
          );
          data = [...data, findData.user_name];
        }
        setAddonsData([...data]);
      }
    }
  }, [providersData]);

  useEffect(() => {
    if (
      allUsersData?.user_roles[0]?.role_name === "Provider" &&
      allUsersData?.assign?.length !== 0
    ) {
      if (servicesData?.length > 0) {
        let data = [];
        for (let i = 0; i < allUsersData?.assign?.length; i++) {
          const findData = servicesData?.find(
            (item) => item?.id === allUsersData?.assign[i]?.service_id
          );
          data = [...data, findData?.name];
        }
        setAddonsData([...data]);
      }
    }
  }, [servicesData]);

  const url = window.location.href;
  useEffect(() => {
    if (user.role !== "Manager") {
      if (
        url !== "http://localhost:3000/users/new/edit" &&
        allUsersData !== null &&
        allUsersData !== undefined &&
        allUsersData.id !== "" &&
        allUsersData?.status !== "Failed"
      ) {
        if (allUsersData?.user_roles[0]?.role_name === "Admin") {
          setUserRole("Admin");
          setAdminForm(true);
          setSecretariesForm(false);
          setProviderForm(false);
        } else if (allUsersData?.user_roles[0]?.role_name === "Provider") {
          setUserRole("Provider");
          setAdminForm(false);
          setSecretariesForm(false);
          setProviderForm(true);
        } else {
          setUserRole("Secretaries");
          setAdminForm(false);
          setSecretariesForm(true);
          setProviderForm(false);
        }
        const convertedArray = allUsersData?.scheduleBody?.map(
          (originalObj) => ({
            day_of_week: originalObj.day_of_week,
            work_start_time: originalObj.work_start_time,
            work_end_time: originalObj.work_end_time,
            break_start_time: originalObj.break_start_time,
            break_end_time: originalObj.break_end_time,
          })
        );
        setAdminData({
          first_name: allUsersData.first_name,
          last_name: allUsersData.last_name,
          email: allUsersData.email,
          phone_number: allUsersData.phone_number,
          mobile_number: allUsersData.mobile_number,
          address: allUsersData.address,
          city: allUsersData.city,
          state: allUsersData.city,
          zip_code: allUsersData.zip_code,
          user_name: allUsersData.user_name,
          password: allUsersData.password,
          time_zone: allUsersData.time_zone,
          calendar: allUsersData.calendar,
          notes: allUsersData.notes,
          role: allUsersData?.user_roles[0]?.role_name,
          id: allUsersData.id,
          assign: allUsersData?.assign?.id,
          scheduleBody: convertedArray,
        });
      }
    } else {
      navigate("/users");
    }
  }, [allUsersData]);
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    mobile_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    user_name: "",
    password: "",
    password_confirmation: "",
    time_zone: "",
    calendar: "",
    notes: "",
    role: "",
    id: "",
    assign: [],
    scheduleBody: [
      {
        day_of_week: "Sunday",
        work_start_time: "9:00 AM",
        work_end_time: "6:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "2:00 PM",
      },
      {
        day_of_week: "Monday",
        work_start_time: "9:00 AM",
        work_end_time: "8:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "3:00 PM",
      },
      {
        day_of_week: "Tuesday",
        work_start_time: "9:00 AM",
        work_end_time: "8:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "3:00 PM",
      },
      {
        day_of_week: "Wednesday",
        work_start_time: "9:00 AM",
        work_end_time: "8:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "3:00 PM",
      },
      {
        day_of_week: "Thursday",
        work_start_time: "9:00 AM",
        work_end_time: "8:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "3:00 PM",
      },
      {
        day_of_week: "Friday",
        work_start_time: "9:00 AM",
        work_end_time: "8:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "3:00 PM",
      },
      {
        day_of_week: "Saturday",
        work_start_time: "9:00 AM",
        work_end_time: "8:00 PM",
        break_start_time: "1:00 PM",
        break_end_time: "3:00 PM",
      },
    ],
  });

  const [error, setError] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    time_zone: "",
    calendar: "",
    zip_code: "",
    city: "",
  });
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleAdminDataChange = (e) => {
    const { name, value } = e.target;

    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    var updatedArray = [];
    console.log(value);
    if (adminData.role === "Manager") {
      for (let i = 0; i < value?.length; i++) {
        const findData = providersDataArray?.find(
          (item) => item.user_name === value[i]
        );
        updatedArray = [...updatedArray, findData?.id];
      }
    } else {
      for (let i = 0; i < value?.length; i++) {
        const findData = servicesData?.find((item) => item.name === value[i]);
        updatedArray = [...updatedArray, findData?.id];
      }
    }

    setAdminData({
      ...adminData,
      assign:
        typeof updatedArray === "string"
          ? updatedArray.split(",")
          : updatedArray,
    });
    handleClose();
    setAddonsData(typeof value === "string" ? value.split(",") : value);
  };

  const handleStartTimeChange = (newTime, dayOfWeek) => {
    const updatedAdminData = { ...adminData };
    const dayIndex = updatedAdminData.scheduleBody.findIndex(
      (item) => item.day_of_week === dayOfWeek
    );
    if (dayIndex !== -1) {
      updatedAdminData.scheduleBody[dayIndex].work_start_time =
        newTime.format("hh:mm A");
      setAdminData(updatedAdminData);
    }
  };

  const handleEndTimeChange = (newTime, dayOfWeek) => {
    const updatedAdminData = { ...adminData };
    const dayIndex = updatedAdminData.scheduleBody.findIndex(
      (item) => item.day_of_week === dayOfWeek
    );
    if (dayIndex !== -1) {
      updatedAdminData.scheduleBody[dayIndex].work_end_time =
        newTime.format("hh:mm A");
      setAdminData(updatedAdminData);
    }
  };
  const handleBreakEndTimeChange = (newTime, dayOfWeek) => {
    const updatedAdminData = { ...adminData };
    const dayIndex = updatedAdminData.scheduleBody.findIndex(
      (item) => item.day_of_week === dayOfWeek
    );
    if (dayIndex !== -1) {
      updatedAdminData.scheduleBody[dayIndex].break_end_time =
        newTime.format("hh:mm A");
      setAdminData(updatedAdminData);
    }
  };
  const handleBreakStartTimeChange = (newTime, dayOfWeek) => {
    const updatedAdminData = { ...adminData };
    const dayIndex = updatedAdminData.scheduleBody.findIndex(
      (item) => item.day_of_week === dayOfWeek
    );
    if (dayIndex !== -1) {
      updatedAdminData.scheduleBody[dayIndex].break_start_time =
        newTime.format("hh:mm A");
      setAdminData(updatedAdminData);
    }
  };

  const onSubmitUpdateUserData = () => {
    dispatch(updateContact(adminData)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: "User updated successfully.",
            variant: "success",
          })
        );
        navigate("/users/");
      } else if (res?.payload?.error) {
        if (
          res?.payload?.error?.password ===
          "Password must contain at least 1 numeric character, 1 uppercase letter, and 1 special symbol"
        ) {
          setError({
            ...res.payload.error,
            password: `
            <ul>
            <li>* Password must contain at least 1 numeric character.</li>
            <li>* Password must contain at least 1 uppercase letter.</li>
            <li>* Password must contain at least 1 special symbol.</li>
          </ul>
        `,
          });
        } else {
          setError({
            ...res.payload.error,
          });
        }
      } else {
        setError({
          ...res.payload.errors,
        });
      }
    });
  };

  const onSubmitAdmin = () => {
    dispatch(addContact(adminData)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: "User Created successfully.",
            variant: "success",
          })
        );
        navigate("/users/");
      } else if (res?.payload?.error) {
        if (
          res?.payload?.error?.password ===
          "Password must contain at least 1 numeric character, 1 uppercase letter, and 1 special symbol"
        ) {
          setError({
            ...res.payload.error,
            password: `
            <ul>
            <li>* Password must contain at least 1 numeric character.</li>
            <li>* Password must contain at least 1 uppercase letter.</li>
            <li>* Password must contain at least 1 special symbol.</li>
          </ul>
        `,
          });
        } else {
          setError({
            ...res.payload.error,
          });
        }
      } else {
        setError({
          ...res.payload.errors,
        });
      }
    });
  };

  const handleUserType = (e) => {
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    const { value } = e.target;
    if (value === "Admin") {
      setUserRole(value);
      setAdminData({
        ...adminData,
        role: "Admin",
      });
      setAdminForm(true);
      setSecretariesForm(false);
      setProviderForm(false);
    } else if (value === "Provider") {
      setUserRole(value);
      setAdminForm(false);
      setSecretariesForm(false);
      setProviderForm(true);
      setAdminData({
        ...adminData,
        role: "Provider",
      });
    } else {
      setUserRole(value);
      setAdminForm(false);
      setSecretariesForm(true);
      setProviderForm(false);
      setAdminData({
        ...adminData,
        role: "Manager",
      });
    }
  };

  const handleProviderDetails = () => {
    setWorkingPlan(false);
    setDetails(true);
  };

  const handleProviderWorkingPlan = () => {
    setWorkingPlan(true);
    setDetails(false);
  };

  return (
    <div
      className="relative"
      style={{
        margin: "37px",
      }}
    >
      {url !== "http://localhost:3000/users/new/edit" &&
      allUsersData !== null &&
      allUsersData !== undefined &&
      allUsersData.id !== "" ? (
        <FormControl
          fullWidth
          style={{
            marginTop: "50px",
          }}
        >
          <InputLabel id="demo-simple-select-label">User Type</InputLabel>
          <Select
            disabled
            labelId="demo-simple-select-label"
            defaultValue={adminData.role}
            id="demo-simple-select"
            name="role"
            value={userRole}
            onChange={(e) => {
              handleUserType(e);
            }}
            label="User Type"
          >
            {user.role === "SuperAdmin" ? (
              <MenuItem value={"Admin"}>Admin</MenuItem>
            ) : null}

            <MenuItem value={"Secretaries"}>Secretaries</MenuItem>
            <MenuItem value={"Provider"}>Provider</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <FormControl
          fullWidth
          style={{
            marginTop: "50px",
          }}
        >
          <InputLabel id="demo-simple-select-label">User Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            defaultValue={adminData.role}
            id="demo-simple-select"
            name="role"
            value={userRole}
            onChange={(e) => {
              handleUserType(e);
            }}
            label="User Type"
          >
            {user.role === "SuperAdmin" ? (
              <MenuItem value={"Admin"}>Admin</MenuItem>
            ) : null}

            <MenuItem value={"Secretaries"}>Secretaries</MenuItem>
            <MenuItem value={"Provider"}>Provider</MenuItem>
          </Select>
        </FormControl>
      )}

      {adminForm ? (
        <div>
          <div className="relative flex flex-col flex-auto items-center ">
            <TextField
              className="mt-32"
              label="First Name"
              placeholder="First Name"
              id="name"
              name="first_name"
              value={adminData.first_name}
              error={!!error.first_name}
              helperText={error.first_name}
              variant="outlined"
              required
              fullWidth
              onChange={(e) => handleAdminDataChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              label="Last Name"
              placeholder="Last Name"
              id="name"
              variant="outlined"
              name="last_name"
              value={adminData.last_name}
              error={!!error.last_name}
              helperText={error.last_name}
              required
              onChange={(e) => handleAdminDataChange(e)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
            {url === "http://localhost:3000/users/new/edit" ? (
              <TextField
                //   {...field}
                className="mt-32"
                label="Email"
                placeholder="Email"
                name="email"
                value={adminData.email}
                error={!!error.email}
                helperText={error.email}
                variant="outlined"
                fullWidth
                required
                onChange={(e) => handleAdminDataChange(e)}
                //   error={!!errors.email}
                //   helperText={errors?.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}

            <TextField
              className="mt-32"
              label="Phone Number"
              placeholder="Phone Number"
              id="name"
              type="number"
              name="phone_number"
              value={adminData.phone_number}
              error={!!error.phone_number}
              helperText={error.phone_number}
              onChange={(e) => handleAdminDataChange(e)}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              label="Mobile Number"
              placeholder="Mobile Number"
              name="mobile_number"
              type="number"
              value={adminData.mobile_number}
              onChange={(e) => handleAdminDataChange(e)}
              id="name"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              // {...field}
              label="Address"
              placeholder="Address"
              name="address"
              value={adminData.address}
              onChange={(e) => handleAdminDataChange(e)}
              id="address"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:location-marker
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              label="City"
              placeholder="City"
              name="city"
              value={adminData.city}
              onChange={(e) => handleAdminDataChange(e)}
              id="name"
              error={!!error.city}
              helperText={error.city}
              variant="outlined"
              fullWidth
            />
            <TextField
              className="mt-32"
              label="State"
              placeholder="State"
              id="name"
              onChange={(e) => handleAdminDataChange(e)}
              name="state"
              value={adminData.state}
              variant="outlined"
              fullWidth
            />

            <TextField
              className="mt-32"
              label="Zip Code"
              placeholder="Zip Code"
              id="name"
              error={!!error.zip_code}
              helperText={error.zip_code}
              onChange={(e) => handleAdminDataChange(e)}
              name="zip_code"
              value={adminData.zip_code}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <TextField
              className="mt-32"
              label="UserName"
              placeholder="UserName"
              error={!!error.user_name}
              helperText={error.user_name}
              onChange={(e) => handleAdminDataChange(e)}
              id="name"
              name="user_name"
              value={adminData.user_name}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
            {url === "http://localhost:3000/users/new/edit" ? (
              <>
                {" "}
                <TextField
                  className="mt-32"
                  label="Password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  error={!!error.password}
                  helperText={
                    error.password ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: error.password }}
                      />
                    ) : null
                  }
                  value={adminData.password}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  // error={!!errors.name}
                  // helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        style={{ cursor: "pointer" }}
                        position="right"
                        onClick={() => handleClickShowPassword()}
                      >
                        {showPassword ? (
                          <AiFillEye size={20} />
                        ) : (
                          <AiFillEyeInvisible size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  label="Retype Password"
                  placeholder="Retype Password"
                  error={!!error.password_confirmation}
                  helperText={error.password_confirmation}
                  name="password_confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={adminData.password_confirmation}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        style={{ cursor: "pointer" }}
                        position="right"
                        onClick={() => handleClickShowPasswordConfirmation()}
                      >
                        {showPasswordConfirmation ? (
                          <AiFillEye size={20} />
                        ) : (
                          <AiFillEyeInvisible size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : null}

            <FormControl fullWidth className="mt-32">
              <InputLabel id="demo-timezones">Timezones*</InputLabel>
              <Select
                labelId="demo-timezones-select"
                id="time_zone"
                label="Timezones*"
                error={!!error.time_zone}
                helperText={error.time_zone}
                name="time_zone"
                required
                onChange={(e) => handleAdminDataChange(e)}
                value={adminData.time_zone}
              >
                {data.map((item) => (
                  <MenuItem value={item.name}>
                    {item.name}({item.dstOffsetStr})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth className="mt-32">
              <InputLabel id="demo-simple-select-label">Calendar</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Calendar"
                error={!!error.calendar}
                helperText={error.calendar}
                onChange={(e) => handleAdminDataChange(e)}
                name="calendar"
                value={adminData.calendar}
                defaultValue={"Default"}
                required
              >
                <MenuItem value={"Default"}>default</MenuItem>
                <MenuItem value={"Table"}>Table</MenuItem>
              </Select>
            </FormControl>

            <TextField
              className="mt-32"
              // {...field}
              label="Notes"
              placeholder="Notes"
              id="notes"
              name="notes"
              value={adminData.notes}
              onChange={(e) => handleAdminDataChange(e)}
              // error={!!errors.notes}
              // helperText={errors?.notes?.message}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              InputProps={{
                className: "max-h-min h-min items-start",
                startAdornment: (
                  <InputAdornment className="mt-16" position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:menu-alt-2
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Box
            className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
            sx={{ backgroundColor: "background.default" }}
          >
            <Button className="ml-auto">
              <Link to="/users/">Cancel</Link>
            </Button>

            {url !== "http://localhost:3000/users/new/edit" &&
            allUsersData !== null &&
            allUsersData !== undefined &&
            allUsersData.id !== "" ? (
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                onClick={() => onSubmitUpdateUserData()}
                // disabled={_.isEmpty(dirtyFields) || !isValid}
                // onClick={handleSubmit(onSubmit)}
              >
                Update
              </Button>
            ) : (
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                onClick={() => onSubmitAdmin()}
                // disabled={_.isEmpty(dirtyFields) || !isValid}
                // onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            )}
          </Box>
        </div>
      ) : null}
      {providerForm ? (
        <div>
          <div className="relative flex flex-col flex-auto items-center ">
            <div className="flex flex-row mt-32">
              <Button
                variant="contained"
                style={{
                  margin: "0px 14px",
                }}
                onClick={() => {
                  handleProviderDetails();
                }}
              >
                Details
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleProviderWorkingPlan();
                }}
              >
                Working Plan
              </Button>
            </div>
            {details ? (
              <>
                {" "}
                <TextField
                  className="mt-32"
                  label="First Name"
                  placeholder="First Name"
                  id="name"
                  name="first_name"
                  value={adminData.first_name}
                  error={!!error.first_name}
                  helperText={error.first_name}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => handleAdminDataChange(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:user-circle
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  label="Last Name"
                  placeholder="Last Name"
                  id="name"
                  variant="outlined"
                  name="last_name"
                  value={adminData.last_name}
                  error={!!error.last_name}
                  helperText={error.last_name}
                  required
                  onChange={(e) => handleAdminDataChange(e)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:user-circle
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                {url === "http://localhost:3000/users/new/edit" ? (
                  <TextField
                    //   {...field}
                    className="mt-32"
                    label="Email"
                    placeholder="Email"
                    name="email"
                    value={adminData.email}
                    error={!!error.email}
                    helperText={error.email}
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) => handleAdminDataChange(e)}
                    //   error={!!errors.email}
                    //   helperText={errors?.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:mail
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : null}
                <TextField
                  className="mt-32"
                  label="Phone Number"
                  placeholder="Phone Number"
                  id="name"
                  type="number"
                  name="phone_number"
                  value={adminData.phone_number}
                  error={!!error.phone_number}
                  helperText={error.phone_number}
                  onChange={(e) => handleAdminDataChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:phone
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  name="mobile_number"
                  type="number"
                  value={adminData.mobile_number}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:phone
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  // {...field}
                  label="Address"
                  placeholder="Address"
                  name="address"
                  value={adminData.address}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="address"
                  // error={!!errors.address}
                  // helperText={errors?.address?.message}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:location-marker
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  label="City"
                  placeholder="City"
                  name="city"
                  value={adminData.city}
                  error={!!error.city}
                  helperText={error.city}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  // error={!!errors.name}
                  // helperText={errors?.name?.message}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-32"
                  label="State"
                  placeholder="State"
                  id="name"
                  onChange={(e) => handleAdminDataChange(e)}
                  name="state"
                  value={adminData.state}
                  // error={!!errors.name}
                  // helperText={errors?.name?.message}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-32"
                  label="Zip Code"
                  placeholder="Zip Code"
                  error={!!error.zip_code}
                  helperText={error.zip_code}
                  id="name"
                  onChange={(e) => handleAdminDataChange(e)}
                  name="zip_code"
                  value={adminData.zip_code}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  label="UserName"
                  placeholder="UserName"
                  error={!!error.user_name}
                  helperText={error.user_name}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  name="user_name"
                  value={adminData.user_name}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:user-circle
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                {url === "http://localhost:3000/users/new/edit" ? (
                  <>
                    {" "}
                    <TextField
                      className="mt-32"
                      // {...field}
                      label="Password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      error={!!error.password}
                      helperText={
                        error.password ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: error.password }}
                          />
                        ) : null
                      }
                      value={adminData.password}
                      onChange={(e) => handleAdminDataChange(e)}
                      id="name"
                      variant="outlined"
                      required
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            style={{ cursor: "pointer" }}
                            position="right"
                            onClick={() => handleClickShowPassword()}
                          >
                            {showPassword ? (
                              <AiFillEye size={20} />
                            ) : (
                              <AiFillEyeInvisible size={20} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      className="mt-32"
                      label="Retype Password"
                      placeholder="Retype Password"
                      error={!!error.password_confirmation}
                      helperText={error.password_confirmation}
                      name="password_confirmation"
                      type={showPasswordConfirmation ? "text" : "password"}
                      value={adminData.password_confirmation}
                      onChange={(e) => handleAdminDataChange(e)}
                      id="name"
                      variant="outlined"
                      required
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            style={{ cursor: "pointer" }}
                            position="right"
                            onClick={() =>
                              handleClickShowPasswordConfirmation()
                            }
                          >
                            {showPasswordConfirmation ? (
                              <AiFillEye size={20} />
                            ) : (
                              <AiFillEyeInvisible size={20} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                ) : null}
                <FormControl fullWidth className="mt-32">
                  <InputLabel id="demo-timezones">Timezones*</InputLabel>
                  <Select
                    labelId="demo-timezones-select"
                    id="time_zone"
                    label="Timezones*"
                    error={!!error.time_zone}
                    helperText={error.time_zone}
                    name="time_zone"
                    required
                    onChange={(e) => handleAdminDataChange(e)}
                    value={adminData.time_zone}
                  >
                    {data.map((item) => (
                      <MenuItem value={item.name}>
                        {item.name}({item.dstOffsetStr})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth className="mt-32">
                  <InputLabel id="demo-simple-select-label">
                    Calendar
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Calendar"
                    error={!!error.calendar}
                    helperText={error.calendar}
                    onChange={(e) => handleAdminDataChange(e)}
                    name="calendar"
                    value={adminData.calendar}
                    defaultValue={"Default"}
                    required
                  >
                    <MenuItem value={"Default"}>default</MenuItem>
                    <MenuItem value={"Table"}>Table</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  className="mt-32"
                  // {...field}
                  label="Notes"
                  placeholder="Notes"
                  id="notes"
                  name="notes"
                  value={adminData.notes}
                  onChange={(e) => handleAdminDataChange(e)}
                  // error={!!errors.notes}
                  // helperText={errors?.notes?.message}
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  InputProps={{
                    className: "max-h-min h-min items-start",
                    startAdornment: (
                      <InputAdornment className="mt-16" position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:menu-alt-2
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl sx={{ width: "100%" }} className="mt-32">
                  <InputLabel id="demo-multiple-name-label">
                    Select Services
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={addonsData}
                    onChange={handleChange}
                    input={<OutlinedInput label="Select Services" />}
                    MenuProps={MenuProps}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={isOpen}
                  >
                    {servicesData?.map((name) => (
                      <MenuItem
                        key={name.name}
                        value={name.name}
                        style={getStyles(name?.name, addonsData, theme)}
                      >
                        {name.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : null}

            {workingPlan ? (
              <>
                <h1 className="mt-32">Working Plan</h1>
                <TableContainer className="mt-32" component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Day</StyledTableCell>
                        <StyledTableCell align="left">Start</StyledTableCell>
                        <StyledTableCell align="left">End</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {adminData?.scheduleBody?.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell component="th" scope="row">
                            {/* <Checkbox defaultChecked /> */}
                            {row.day_of_week}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["TimePicker", "TimePicker"]}
                              >
                                <TimePicker
                                  label="Uncontrolled picker"
                                  defaultValue={dayjs(
                                    `${dayjs().format("YYYY-MM-DD")} ${
                                      row.work_start_time
                                    }`,
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                  onChange={(newTime) =>
                                    handleStartTimeChange(
                                      newTime,
                                      row.day_of_week
                                    )
                                  }
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["TimePicker", "TimePicker"]}
                              >
                                <TimePicker
                                  label="Uncontrolled picker"
                                  defaultValue={dayjs(
                                    `${dayjs().format("YYYY-MM-DD")} ${
                                      row.work_end_time
                                    }`,
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                  onChange={(newTime) =>
                                    handleEndTimeChange(
                                      newTime,
                                      row.day_of_week
                                    )
                                  }
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <h1 className="mt-32">Breaks</h1>
                <p>
                  Add the working breaks during each day. During breaks the
                  provider will not accept any appointments.
                </p>
                <TableContainer className="mt-32" component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Day</StyledTableCell>
                        <StyledTableCell align="left">Start</StyledTableCell>
                        <StyledTableCell align="left">End</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {adminData?.scheduleBody?.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell component="th" scope="row">
                            {row.day_of_week}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["TimePicker", "TimePicker"]}
                              >
                                <TimePicker
                                  label="Uncontrolled picker"
                                  defaultValue={dayjs(
                                    `${dayjs().format("YYYY-MM-DD")} ${
                                      row.break_start_time
                                    }`,
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                  onChange={(newTime) =>
                                    handleBreakStartTimeChange(
                                      newTime,
                                      row.day_of_week
                                    )
                                  }
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["TimePicker", "TimePicker"]}
                              >
                                <TimePicker
                                  label="Uncontrolled picker"
                                  defaultValue={dayjs(
                                    `${dayjs().format("YYYY-MM-DD")} ${
                                      row.break_end_time
                                    }`,
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                  onChange={(newTime) =>
                                    handleBreakEndTimeChange(
                                      newTime,
                                      row.day_of_week
                                    )
                                  }
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : null}

            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
              sx={{ backgroundColor: "background.default" }}
            >
              <Button className="ml-auto">
                <Link to="/users/">Cancel</Link>
              </Button>
              {url !== "http://localhost:3000/users/new/edit" &&
              allUsersData !== null &&
              allUsersData !== undefined &&
              allUsersData.id !== "" ? (
                <Button
                  className="ml-8"
                  variant="contained"
                  color="secondary"
                  onClick={() => onSubmitUpdateUserData()}
                  // disabled={_.isEmpty(dirtyFields) || !isValid}
                  // onClick={handleSubmit(onSubmit)}
                >
                  Update
                </Button>
              ) : (
                <Button
                  className="ml-8"
                  variant="contained"
                  color="secondary"
                  onClick={() => onSubmitAdmin()}
                  // disabled={_.isEmpty(dirtyFields) || !isValid}
                  // onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              )}
            </Box>
          </div>
        </div>
      ) : null}
      {secretariesForm ? (
        <div>
          <div className="relative flex flex-col flex-auto items-center ">
            <TextField
              className="mt-32"
              label="First Name"
              placeholder="First Name"
              id="name"
              name="first_name"
              value={adminData.first_name}
              error={!!error.first_name}
              helperText={error.first_name}
              variant="outlined"
              required
              fullWidth
              onChange={(e) => handleAdminDataChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              label="Last Name"
              placeholder="Last Name"
              id="name"
              variant="outlined"
              name="last_name"
              value={adminData.last_name}
              error={!!error.last_name}
              helperText={error.last_name}
              required
              onChange={(e) => handleAdminDataChange(e)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
            {url === "http://localhost:3000/users/new/edit" ? (
              <TextField
                //   {...field}
                className="mt-32"
                label="Email"
                placeholder="Email"
                name="email"
                value={adminData.email}
                error={!!error.email}
                helperText={error.email}
                variant="outlined"
                fullWidth
                required
                onChange={(e) => handleAdminDataChange(e)}
                //   error={!!errors.email}
                //   helperText={errors?.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}

            <TextField
              className="mt-32"
              label="Phone Number"
              placeholder="Phone Number"
              id="name"
              type="number"
              name="phone_number"
              value={adminData.phone_number}
              error={!!error.phone_number}
              helperText={error.phone_number}
              onChange={(e) => handleAdminDataChange(e)}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              label="Mobile Number"
              placeholder="Mobile Number"
              name="mobile_number"
              type="number"
              value={adminData.mobile_number}
              onChange={(e) => handleAdminDataChange(e)}
              id="name"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              // {...field}
              label="Address"
              placeholder="Address"
              name="address"
              value={adminData.address}
              onChange={(e) => handleAdminDataChange(e)}
              id="address"
              // error={!!errors.address}
              // helperText={errors?.address?.message}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:location-marker
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="mt-32"
              label="City"
              placeholder="City"
              name="city"
              value={adminData.city}
              error={!!error.city}
              helperText={error.city}
              onChange={(e) => handleAdminDataChange(e)}
              id="name"
              variant="outlined"
              fullWidth
            />
            <TextField
              className="mt-32"
              label="State"
              placeholder="State"
              id="name"
              onChange={(e) => handleAdminDataChange(e)}
              name="state"
              value={adminData.state}
              variant="outlined"
              fullWidth
            />

            <TextField
              className="mt-32"
              label="Zip Code"
              placeholder="Zip Code"
              error={!!error.zip_code}
              helperText={error.zip_code}
              id="name"
              onChange={(e) => handleAdminDataChange(e)}
              name="zip_code"
              value={adminData.zip_code}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <TextField
              className="mt-32"
              // {...field}
              label="UserName"
              placeholder="UserName"
              error={!!error.user_name}
              helperText={error.user_name}
              onChange={(e) => handleAdminDataChange(e)}
              id="name"
              name="user_name"
              value={adminData.user_name}
              // error={!!errors.name}
              // helperText={errors?.name?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
            {url === "http://localhost:3000/users/new/edit" ? (
              <>
                {" "}
                <TextField
                  className="mt-32"
                  // {...field}
                  label="Password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  error={!!error.password}
                  helperText={
                    error.password ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: error.password }}
                      />
                    ) : null
                  }
                  value={adminData.password}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  // error={!!errors.name}
                  // helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        style={{ cursor: "pointer" }}
                        position="right"
                        onClick={() => handleClickShowPassword()}
                      >
                        {showPassword ? (
                          <AiFillEye size={20} />
                        ) : (
                          <AiFillEyeInvisible size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className="mt-32"
                  label="Retype Password"
                  placeholder="Retype Password"
                  error={!!error.password_confirmation}
                  helperText={error.password_confirmation}
                  name="password_confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={adminData.password_confirmation}
                  onChange={(e) => handleAdminDataChange(e)}
                  id="name"
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        style={{ cursor: "pointer" }}
                        position="right"
                        onClick={() => handleClickShowPasswordConfirmation()}
                      >
                        {showPasswordConfirmation ? (
                          <AiFillEye size={20} />
                        ) : (
                          <AiFillEyeInvisible size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : null}

            <FormControl fullWidth className="mt-32">
              <InputLabel id="demo-timezones">Timezones*</InputLabel>
              <Select
                labelId="demo-timezones-select"
                id="time_zone"
                label="Timezones*"
                error={!!error.time_zone}
                helperText={error.time_zone}
                name="time_zone"
                required
                onChange={(e) => handleAdminDataChange(e)}
                value={adminData.time_zone}
              >
                {data.map((item) => (
                  <MenuItem value={item.name}>
                    {item.name}({item.dstOffsetStr})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth className="mt-32">
              <InputLabel id="demo-simple-select-label">Calendar</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Calendar"
                error={!!error.calendar}
                helperText={error.calendar}
                onChange={(e) => handleAdminDataChange(e)}
                name="calendar"
                value={adminData.calendar}
                defaultValue={"Default"}
                required
              >
                <MenuItem value={"Default"}>default</MenuItem>
                <MenuItem value={"Table"}>Table</MenuItem>
              </Select>
            </FormControl>

            <TextField
              className="mt-32"
              // {...field}
              label="Notes"
              placeholder="Notes"
              id="notes"
              name="notes"
              value={adminData.notes}
              onChange={(e) => handleAdminDataChange(e)}
              // error={!!errors.notes}
              // helperText={errors?.notes?.message}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              InputProps={{
                className: "max-h-min h-min items-start",
                startAdornment: (
                  <InputAdornment className="mt-16" position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:menu-alt-2
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <FormControl sx={{ width: "100%" }} className="mt-32">
            <InputLabel id="demo-multiple-name-label">
              Select Providers
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={addonsData}
              onChange={handleChange}
              input={<OutlinedInput label="Select Providers" />}
              MenuProps={MenuProps}
              onClose={handleClose}
              onOpen={handleOpen}
              open={isOpen}
            >
              {providersDataArray?.map((name) => (
                <MenuItem
                  key={name.user_name}
                  value={name.user_name}
                  style={getStyles(name?.user_name, addonsData, theme)}
                >
                  {name.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
            sx={{ backgroundColor: "background.default" }}
          >
            <Button className="ml-auto">
              <Link to="/users/">Cancel</Link>
            </Button>
            {url !== "http://localhost:3000/users/new/edit" &&
            allUsersData !== null &&
            allUsersData !== undefined &&
            allUsersData.id !== "" ? (
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                onClick={() => onSubmitUpdateUserData()}
              >
                Update
              </Button>
            ) : (
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                onClick={() => onSubmitAdmin()}
                // disabled={_.isEmpty(dirtyFields) || !isValid}
                // onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            )}
          </Box>
        </div>
      ) : null}
    </div>
  );
}

export default ContactForm;
