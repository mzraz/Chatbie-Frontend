import TextField from "@mui/material/TextField";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormHelperText,
} from "@mui/material";
import { getAllISOCodes } from "iso-country-currency";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createAndUpdateService } from "../../store/serviceSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { setupKey } from "src/configurationKeys";
import { useFormContext } from "react-hook-form";
import { showMessage } from "app/store/fuse/messageSlice";

const currencies = getAllISOCodes();
function BasicInfoTab(props) {
  const methods = useFormContext();
  const { formState } = methods;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [category_id, setcategory_id] = useState([]);
  const [addNewService, setNewService] = useState({
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
  });

  const navigate = useNavigate();

  const [error, setError] = useState({
    name: "",
    duration: "",
    price: "",
    category_id: "",
    attendant_number: "",
    currencies: "",
  });

  useEffect(() => {
    const data = async () => {
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
      setcategory_id([...data]);

      const category = data?.find(
        (item) => item?.id === formState?.defaultValues?.category_id
      );

      if (
        formState.defaultValues?.id !== "" &&
        formState?.defaultValues?.status !== "Failed"
      ) {
        const totalMinutes =
          (formState?.defaultValues?.duration?.hours || 0) * 60 +
          (formState?.defaultValues?.duration?.minutes || 0);

        const totalMin = formState?.defaultValues?.duration?.minutes;

        setNewService({
          name: formState?.defaultValues?.name,
          duration: !isNaN(totalMinutes) ? totalMinutes : totalMin,
          price: formState?.defaultValues?.price,
          currencies: formState?.defaultValues?.currencies,
          category_id: category.name,
          availabilities_type: formState?.defaultValues?.availabilities_type,
          attendant_number: formState?.defaultValues?.attendant_number,
          location: formState?.defaultValues?.location,
          description: formState?.defaultValues?.description,
          id: formState?.defaultValues?.id,
        });
      }
    };
    data();
  }, []);
  function onSubmit() {
    const categoryId = category_id.find(
      (item) => item.name === addNewService.category_id
    );
    const hours = Math.floor(addNewService.duration / 60);
    const remainingMinutes = addNewService.duration % 60;
    const seconds = 0;
    var formattedTime;
    if (remainingMinutes > 0) {
      formattedTime = `${String(hours).padStart(2, "0")}:${String(
        remainingMinutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else if (remainingMinutes === 0) {
      formattedTime = `${String(1).padStart(2, "0")}:${String(0).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    } else {
      setError({
        ...error,
        duration: "Time duration value cannot be negative",
      });
    }
    if (formattedTime) {
      var updateService = {
        ...addNewService,
        category_id: categoryId?.id,
        duration: formattedTime,
      };

      dispatch(createAndUpdateService(updateService)).then((res) => {
        if (
          !res?.payload?.errors &&
          res?.payload !== undefined &&
          !res?.payload?.error
        ) {
          dispatch(
            showMessage({
              message: `${res.payload.message}`,
              variant: "success",
            })
          );
          navigate("/services/");
        } else if (typeof res?.payload?.error === "string") {
          setError({
            name: res.payload.error,
          });
        } else if (typeof res?.payload?.error === "object") {
          setError({
            ...res.payload.error,
          });
        }
      });
    }
  }

  const onUpdate = () => {
    var setErrors = {
      name: "",
      duration: "",
      price: "",
      category_id: "",
      currencies: "",
    };
    const categoryId = category_id.find(
      (item) => item.name === addNewService.category_id
    );
    const hours = Math.floor(addNewService.duration / 60);
    const remainingMinutes = addNewService.duration % 60;
    const seconds = 0;
    var formattedTime;

    if (remainingMinutes > 0) {
      formattedTime = `${String(hours).padStart(2, "0")}:${String(
        remainingMinutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else if (remainingMinutes === 0) {
      formattedTime = `${String(1).padStart(2, "0")}:${String(0).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    } else {
      setErrors.duration = "Time duration value cannot be negative";
    }
    if (addNewService.price < 0) {
      setErrors.price = "Price must be a positive number";
    }
    if (addNewService.name === "") {
      setErrors.name = "Name cannot be allowed to be empty";
    }
    if (addNewService.currencies === "") {
      setErrors.currencies = "Currency is not allowed to be empty";
    }

    setError({ ...setErrors });
    if (formattedTime && addNewService.price > 0 && addNewService.name !== "") {
      var updateService = {
        ...addNewService,
        category_id: categoryId?.id,
        duration: formattedTime,
      };
      dispatch(createAndUpdateService(updateService)).then((res) => {
        if (
          !res?.payload?.errors &&
          res?.payload !== undefined &&
          !res?.payload?.error
        ) {
          dispatch(
            showMessage({
              message: `${res.payload.message}`,
              variant: "success",
            })
          );
          navigate("/services/");
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
    }
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <TextField
        className="mt-8 mb-16"
        required
        label="Name"
        autoFocus
        id="name"
        value={addNewService.name}
        error={!!error.name}
        helperText={error.name}
        name="name"
        onChange={(e) => handleNewServiceChange(e)}
        variant="outlined"
        fullWidth
      />
      <TextField
        className="mt-8 mb-16"
        required
        name="duration"
        label="Duration(mins)"
        value={addNewService.duration}
        error={!!error.duration}
        helperText={error.duration}
        onChange={(e) => handleNewServiceChange(e)}
        minRows={0}
        id="name"
        variant="outlined"
        fullWidth
        type="number"
      />

      <TextField
        className="mt-8 mb-16"
        required
        min="0"
        name="price"
        value={addNewService.price}
        error={!!error.price}
        helperText={error.price}
        onChange={(e) => handleNewServiceChange(e)}
        label="Price"
        variant="outlined"
        fullWidth
        inputProps={{
          min: 0,
        }}
        type="number"
      />

      <FormControl fullWidth className="mt-8 mb-16">
        <InputLabel id="demo-currencies">Currencies*</InputLabel>
        <Select
          labelId="demo-currencies-select"
          id="currencies"
          label="Currencies*"
          error={!!error.currencies}
          helperText={error.currencies}
          value={addNewService.currencies}
          onChange={(e) => handleNewServiceChange(e)}
          name="currencies"
          // onChange={(e) => handleCustomerChange(e)}
        >
          {currencies.map((item, index) => (
            <MenuItem value={item.symbol}>
              {item.countryName}-({item.symbol})
            </MenuItem>
          ))}
        </Select>
        <FormHelperText
          style={{
            color: "#e74133",
          }}
        >
          {error.currencies}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth className="mt-8 mb-16">
        <InputLabel id="demo-category_id">category*</InputLabel>
        <Select
          labelId="demo-category_id-select"
          id="category"
          value={addNewService.category_id}
          error={!!error.category_id}
          helperText={error.category_id}
          label="category"
          name="category_id"
          onChange={(e) => handleNewServiceChange(e)}
          required
        >
          {category_id.map((item, index) => (
            <MenuItem value={item.name} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText
          style={{
            color: "#e74133",
          }}
        >
          {error.category_id}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth className="mt-8 mb-16">
        <InputLabel id="demo-category_id">Availabilities Type</InputLabel>
        <Select
          labelId="demo-category_id-select"
          id="Availabilities Type"
          value={addNewService.availabilities_type}
          label="Availabilities Type"
          name="availabilities_type"
          onChange={(e) => handleNewServiceChange(e)}
          // onChange={(e) => handleCustomerChange(e)}
        >
          <MenuItem value={"Fixed"}>Fixed</MenuItem>
          <MenuItem value={"Flexible"}>Flexible</MenuItem>
        </Select>
      </FormControl>
      <TextField
        className="mt-8 mb-16"
        label="Attendants Number*"
        value={addNewService.attendant_number}
        error={!!error.attendant_number}
        helperText={error.attendant_number}
        onChange={(e) => handleNewServiceChange(e)}
        id="name"
        name="attendant_number"
        variant="outlined"
        fullWidth
        type="number"
      />

      <TextField
        className="mt-8 mb-16"
        label="Location"
        value={addNewService.location}
        name="location"
        id="name"
        variant="outlined"
        onChange={(e) => handleNewServiceChange(e)}
        fullWidth
      />

      <TextField
        className="mt-8 mb-16"
        id="description"
        label="Description"
        type="text"
        name="description"
        value={addNewService.description}
        multiline
        onChange={(e) => handleNewServiceChange(e)}
        rows={5}
        variant="outlined"
        fullWidth
      />
      {formState.defaultValues.id !== "" &&
      formState?.defaultValues?.status !== "Failed" ? (
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          onClick={() => {
            onUpdate();
          }}
        >
          Update
        </Button>
      ) : (
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          onClick={() => {
            onSubmit();
          }}
        >
          Save
        </Button>
      )}
    </div>
  );
}

export default BasicInfoTab;
