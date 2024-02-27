import {
  Typography,
  InputAdornment,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { BiLink } from "react-icons/bi";
import { GoOrganization } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfoAboutOrganization } from "app/store/userSlice";
import { useNavigate } from "react-router-dom";
import { showMessage } from "app/store/fuse/messageSlice";
import { selectUser } from "app/store/userSlice";
import "../../../../styles/app-base.css";
import JwtService from "src/app/auth/services/jwtService";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 4,
};

const organizationForm = () => {
  const [projectData, setProjectData] = useState({
    name: "",
    url: "",
    email: "",
  });

  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.organizations?.length > 0) {
      navigate("/appointments/");
    }
  }, []);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [error, setError] = useState({
    name: "",
    url: "",
    email: "",
  });
  const handleProjectDataChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addProject = () => {
    dispatch(updateUserInfoAboutOrganization(projectData)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: `Organization created successfully.`,
            variant: "success",
          })
        );
        JwtService.signInWithToken()
          .then((response) => {
            if (res?.payload?.status === "Success") {
              window.location.reload(navigate("/appointments"));
            }
          })
          .catch((_errors) => {
            _errors.forEach((error) => {
              setError(error.type, {
                type: "manual",
                message: error.message,
              });
            });
          });
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

  return (
    <div>
      <Box className="organizationForm" sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add a new Project
        </Typography>

        <TextField
          className="mt-32"
          label="Project Name"
          placeholder="Project Name"
          id="name"
          variant="outlined"
          name="name"
          value={projectData.name}
          error={!!error.name}
          helperText={error.name}
          required
          onChange={(e) => handleProjectDataChange(e)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GoOrganization size={20} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          //   {...field}
          className="mt-32"
          label="Email"
          placeholder="Email"
          name="email"
          value={projectData.email}
          variant="outlined"
          fullWidth
          required
          error={!!error.email}
          helperText={error.email}
          type="email"
          onChange={(e) => handleProjectDataChange(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className="mt-32"
          label="Project URL"
          placeholder="Project URL"
          id="name"
          variant="outlined"
          name="url"
          value={projectData.url}
          error={!!error.url}
          helperText={error.url}
          required
          onChange={(e) => handleProjectDataChange(e)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BiLink size={20} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          style={{
            margin: "20px 0px",
          }}
          variant="contained"
          onClick={() => addProject()}
        >
          Add Project
        </Button>
      </Box>
    </div>
  );
};

export default organizationForm;
