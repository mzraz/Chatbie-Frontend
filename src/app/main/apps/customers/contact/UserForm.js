import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { showMessage } from "app/store/fuse/messageSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "app/store/userSlice";
import _ from "@lodash";
import { selectContact } from "../store/userSlice";
import { addContact } from "../store/contactsSlice";
import { updateContact } from "../store/userSlice";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { getAllTimezones } from "countries-and-timezones";
import { NavigateBefore } from "@mui/icons-material";

const time_zone = getAllTimezones();

function ContactForm(props) {
  const user = useSelector(selectUser);

  const navigate = useNavigate();
  const data = Object.values(time_zone);
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

  const allUsersData = useSelector(selectContact);
  const url = window.location.href;
  useEffect(() => {
    if (user.role !== "Manager") {
      if (url !== "http://localhost:3000/patients/new/edit") {
        if (allUsersData !== null && allUsersData !== undefined) {
          setAdminData({
            first_name: allUsersData.first_name,
            last_name: allUsersData.last_name,
            email: allUsersData.email,
            phone_number: allUsersData.phone_number,
            address: allUsersData.address,
            city: allUsersData.city,
            zip_code: allUsersData.zip_code,
            time_zone: allUsersData.time_zone,
            calendar: allUsersData.calendar,
            notes: allUsersData.notes,
            language: allUsersData.language,
            id: allUsersData.id,
          });
        }
      }
    } else {
      navigate("/patients");
    }
  }, [allUsersData]);
  const dispatch = useDispatch();
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    zip_code: "",
    time_zone: "",
    calendar: "",
    notes: "",
    language: "",
    id: "",
  });
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    time_zone: "",
    language: "",
    zip_code: "",
    city: "",
  });
  const handlePatientDataChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    dispatch(addContact(adminData)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: "Patient Created successfully.",
            variant: "success",
          })
        );
        navigate("/patients/");
      } else if (typeof res?.payload?.error === "object") {
        setError({
          ...res.payload.error,
        });
      } else if (typeof res?.payload?.error === "string") {
        dispatch(
          showMessage({
            message: res.payload.error,
            variant: "error",
          })
        );
      }
    });
  };

  const onUpdate = () => {
    dispatch(updateContact(adminData)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: "Patient updated successfully.",
            variant: "success",
          })
        );
        navigate("/patients/");
      } else if (res?.payload?.error) {
        setError({
          ...res.payload.error,
        });
      } else {
        setError({
          ...res.payload.errors,
        });
      }
    });
  };

  const backToMain = () => {
    navigate("/patients/");
  };

  return (
    <div
      className="relative"
      style={{
        margin: "37px",
      }}
    >
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
            onChange={(e) => handlePatientDataChange(e)}
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
            onChange={(e) => handlePatientDataChange(e)}
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

          {url !== "http://localhost:3000/patients/new/edit" ? null : (
            <TextField
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
              onChange={(e) => handlePatientDataChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}

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
            onChange={(e) => handlePatientDataChange(e)}
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
            label="Address"
            placeholder="Address"
            name="address"
            value={adminData.address}
            onChange={(e) => handlePatientDataChange(e)}
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
            error={!!error.city}
            helperText={error.city}
            onChange={(e) => handlePatientDataChange(e)}
            id="name"
            variant="outlined"
            fullWidth
          />

          <TextField
            className="mt-32"
            label="Zip Code"
            placeholder="Zip Code"
            id="name"
            onChange={(e) => handlePatientDataChange(e)}
            name="zip_code"
            value={adminData.zip_code}
            error={!!error.zip_code}
            helperText={error.zip_code}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
          />

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
              onChange={(e) => handlePatientDataChange(e)}
              value={adminData.time_zone}
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

          <FormControl fullWidth className="mt-32">
            <InputLabel id="demo-language">language*</InputLabel>
            <Select
              labelId="demo-timezones-select"
              id="language"
              label="language*"
              error={!!error.language}
              helperText={error.language}
              name="language"
              required
              onChange={(e) => handlePatientDataChange(e)}
              value={adminData.language}
              defaultValue={languages[0]}
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

          <FormControl fullWidth className="mt-32">
            <InputLabel id="demo-simple-select-label">Calendar</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Calendar"
              error={!!error.calendar}
              helperText={error.calendar}
              onChange={(e) => handlePatientDataChange(e)}
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
            label="Notes"
            placeholder="Notes"
            id="notes"
            name="notes"
            value={adminData.notes}
            onChange={(e) => handlePatientDataChange(e)}
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
          {/* <Button color="error">Delete</Button> */}
          <Button className="ml-auto" onClick={() => backToMain()}>
            Cancel
          </Button>
          {url !== "http://localhost:3000/patients/new/edit" ? (
            <Button
              className="ml-8"
              variant="contained"
              color="secondary"
              onClick={() => onUpdate()}
            >
              Update
            </Button>
          ) : (
            <Button
              className="ml-8"
              variant="contained"
              color="secondary"
              onClick={() => onSubmit()}
            >
              Save
            </Button>
          )}
        </Box>
      </div>
    </div>
  );
}

export default ContactForm;
