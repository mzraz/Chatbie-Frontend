import Avatar from "@mui/material/Avatar";
import {
  MenuItem,
  Popover,
  InputLabel,
  Select,
  FormControl,
  Typography,
  InputAdornment,
  ListItemText,
  ListItemIcon,
  Modal,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { setUser, selectUser } from "app/store/userSlice";
import { updateUserInfoAboutOrganization } from "app/store/userSlice";

import { BsFillBellFill, BsFillBellSlashFill } from "react-icons/bs";
import { BiWorld, BiLink } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { makeStyles } from "@mui/styles";
import { showMessage } from "app/store/fuse/messageSlice";
import jwtService from "../../auth/services/jwtService";

import { GoOrganization } from "react-icons/go";

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
const useStyles = makeStyles((theme) => ({
  menuItem: {
    "&:hover": {
      backgroundColor: "#FFFFFF", // Change to your desired hover color
    },
  },
}));

function UserMenu(props) {
  const user = useSelector(selectUser);
  const [organizationValue, setOrganizationValue] = useState({
    label: user?.selectedOrganization?.name,
    value: user?.selectedOrganization?.name,
  });

  useEffect(() => {
    setOrganizationValue({
      label: user?.selectedOrganization?.name,
      value: user?.selectedOrganization?.name,
    });
  }, []);

  const [addUniqueOrganization, setAddUniqueOrganization] = useState({
    isNew: false,
  });
  const [projectData, setProjectData] = useState({
    name: "",
    url: "",
    email: "",
  });

  const [error, setError] = useState({
    name: "",
    url: "",
    email: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [userMenu, setUserMenu] = useState(null);
  const classes = useStyles();
  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const openModal = (e) => {
    let value = e.target.value;
    if (value === "unique") {
      setAddUniqueOrganization((prevState) => ({
        ...prevState,
        isNew: true,
      }));
    } else {
      setOrganizationValue({
        label: value,
        value: value,
      });
      setAddUniqueOrganization((prevState) => ({
        ...prevState,
        isNew: false,
      }));
      const userId = user.organizations.find((item) => item.name === value);
      const updatedUser = {
        id: userId.id,
        role: user.role,
        accessToken: user.accessToken,
        data: user.data,
        message: user.message,
      };

      jwtService
        .setOrganizationData(updatedUser)
        .then((user) => {
          navigate("/appointments");
          userMenuClose();
        })
        .catch((_errors) => {
          _errors.forEach((error) => {
            setError(error.type, {
              type: "manual",
              message: error.message,
            });
          });
        });
    }
  };

  const handleProjectDataChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {}, [addUniqueOrganization]);

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const addProject = () => {
    const newErrors = {
      name: "",
      url: "",
      email: "",
    };

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
        window.location.reload();
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
  const cancelProject = () => {
    setAddUniqueOrganization((prevState) => ({
      ...prevState,
      isNew: false,
    }));
  };
  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user?.data?.userName}
          </Typography>
          <Typography
            className="text-11 font-medium capitalize"
            color="text.secondary"
          >
            {user?.role?.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              "Guest"}
          </Typography>
        </div>

        {user?.data?.photoURL ? (
          <Avatar
            className="md:mx-4"
            alt="user photo"
            src={user?.data?.photoURL}
          />
        ) : (
          <Avatar className="md:mx-4">
            {/* {user?.data?.displayName[0]
              ? user?.data?.displayName[0]
              : "zeeshan raza"} */}
          </Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
          background: "#2A3B5A",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
          background: "#2A3B5A",
        }}
        classes={{
          paper: " w-288 flex flex-row justify-center item-center mt-12",
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <div
            style={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Avatar
              style={{
                cursor: "pointer",
                flex: "0 0 100px",
                float: "none",
                height: "100px",
                margin: "40px auto 16px",
                transition: "filter .2s ease-in-out",
                width: "100px",
              }}
              className="md:mx-4"
              alt="user photo"
              src={user.data.photoURL}
            />
            <div className="hidden md:flex flex-col mx-4  items-center ">
              <Typography component="span" className="font-semibold flex">
                {user.data.userName}
              </Typography>
              <Typography
                className="text-11 font-medium capitalize"
                color="text.secondary"
              >
                {user.role.toString()}
                {(!user.role ||
                  (Array.isArray(user.role) && user.role.length === 0)) &&
                  "Guest"}
              </Typography>
            </div>

            <MenuItem className={classes.menuItem}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status"
                >
                  <MenuItem value={10}>
                    <BsFillBellSlashFill />
                    Offline
                  </MenuItem>
                  <MenuItem value={20}>
                    <BsFillBellFill />
                    Online
                  </MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem className={classes.menuItem}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Projects</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  defaultValue={organizationValue?.value}
                  id="organizations_chatbot"
                  disabled={user.role !== "SuperAdmin"}
                  label="Projects"
                  style={{
                    display: "flex",
                  }}
                  value={organizationValue?.value}
                  onChange={(e) => openModal(e)}
                >
                  {user?.organizations?.map((item) => (
                    <MenuItem key={item?.id} value={item?.name}>
                      <BiWorld /> {item?.name}
                    </MenuItem>
                  ))}

                  <hr />
                  {user.role === "SuperAdmin" ? (
                    <MenuItem value={"unique"}>
                      <AiOutlinePlus /> Add Project
                    </MenuItem>
                  ) : null}
                </Select>
              </FormControl>
            </MenuItem>
            <div
              className="flex flex-row justify-center items-center "
              style={{
                margin: "30px",
              }}
            >
              <MenuItem
                className="flex flex-col"
                style={{}}
                component={Link}
                // to="/apps/profile"
                onClick={userMenuClose}
                role="button"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFFFFF";
                }}
              >
                <ListItemIcon
                  style={{
                    minWidth: "0px !important",
                  }}
                >
                  <FuseSvgIcon
                    style={{
                      minWidth: "0px !important",
                    }}
                  >
                    heroicons-outline:user-circle
                  </FuseSvgIcon>
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              <MenuItem
                className="flex flex-col"
                component={NavLink}
                to="/sign-out"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFFFFF";
                }}
                onClick={() => {
                  userMenuClose();
                }}
              >
                <ListItemIcon>
                  <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </MenuItem>

              <Modal
                open={addUniqueOrganization.isNew}
                // onClose={addUniqueOrganization.isNew}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="organizationForm"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
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
                          <FuseSvgIcon size={20}>
                            heroicons-solid:mail
                          </FuseSvgIcon>
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

                  <Button
                    style={{
                      margin: "20px 0px",
                    }}
                    variant="contained"
                    onClick={() => cancelProject()}
                  >
                    Cancel
                  </Button>
                </Box>
              </Modal>
            </div>
          </div>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
