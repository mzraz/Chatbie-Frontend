import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { createAndUpdateCategory } from "../../store/categorySlice";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useNavigate } from "react-router-dom";
import { Controller, useFormContext } from "react-hook-form";

function Categories(props) {
  const methods = useFormContext();
  const { formState } = methods;

  useEffect(() => {
    if (
      formState.defaultValues.id !== "" &&
      formState?.defaultValues?.status !== "Failed"
    ) {
      setNewCategory({
        name: formState.defaultValues.name,
        description: formState.defaultValues.description,
        id: formState.defaultValues.id,
      });
    }
  }, [formState.defaultValues]);

  const [addCategory, setNewCategory] = useState({
    name: "",
    description: "",
    id: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNewCategory = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [error, setError] = useState({
    name: "",
  });

  const onSubmit = () => {
    dispatch(createAndUpdateCategory(addCategory)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: `${res.payload.message} successfully`,
            variant: "success",
          })
        );
        navigate("/categories/");
      } else if (res.payload.error.name) {
        setError({
          ...error,
          name: res.payload.error.name,
        });
      } else {
        setError({
          ...error,
          name: res.payload.error,
        });
      }
    });
  };

  const onUpdate = () => {
    dispatch(createAndUpdateCategory(addCategory)).then((res) => {
      if (res?.payload?.status === "Success") {
        dispatch(
          showMessage({
            message: "Category updated successfully.",
            variant: "success",
          })
        );
        navigate("/categories");
      } else {
        dispatch(
          showMessage({
            message: `${res.payload.error}`,
            variant: "error",
          })
        );
      }
    });
  };

  return (
    <div className="ml-88 flex flex-col">
      {/* <h1>Add New Category </h1> */}
      <TextField
        className="mt-8 mb-16 w-256"
        required
        name="name"
        label="Name"
        value={addCategory.name}
        error={!!error.name}
        helperText={error.name}
        autoFocus
        id="name"
        onChange={(e) => handleNewCategory(e)}
        variant="outlined"
        fullWidth
      />

      <TextField
        className="mt-8 mb-16  w-384"
        id="description"
        label="Description"
        value={addCategory.description}
        type="text"
        multiline
        name="description"
        rows={5}
        variant="outlined"
        onChange={(e) => handleNewCategory(e)}
        fullWidth
      />
      {formState.defaultValues.id !== "" &&
      formState?.defaultValues?.status !== "Failed" ? (
        <Button
          variant="contained"
          color="primary"
          className="mt-8 mb-16  w-68"
          onClick={() => onUpdate()}
          type="button"
        >
          Update
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className="mt-8 mb-16  w-68"
          onClick={() => onSubmit()}
          type="button"
        >
          Save
        </Button>
      )}
    </div>
  );
}

export default Categories;
