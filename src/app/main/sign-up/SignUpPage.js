import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useState } from "react";
import _ from "@lodash";
import Box from "@mui/material/Box";
import { InputAdornment } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { signUpUserAdmin } from "./store/signUpSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [signUpData, setSignUpData] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const createSAdmin = () => {
    if (parseInt(signUpData.phone_number) < 0) {
      setError({
        ...error,
        phone_number: "Phone number must not be negative",
      });
    }

    dispatch(signUpUserAdmin(signUpData)).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: "Super Admin Created successfully.",
            variant: "success",
          })
        );
        navigate("/sign-in");
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

  const event = new CustomEvent("saiz-widget-container", {
    detail: {
      lang: "english",
      productcode: "12343",
      brandcode: "13432",
      visitorid: "Zeeshan",
    },
  });

  window.dispatchEvent(event);

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-48" src="assets/images/logo/logo.svg" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign up
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Already have an account?</Typography>
            <Link className="ml-4" to="/sign-in">
              Sign in
            </Link>
          </div>

          <TextField
            className="mb-24 mt-14"
            label="Display name"
            autoFocus
            type="text"
            name="user_name"
            variant="outlined"
            required
            error={!!error.user_name}
            helperText={error.user_name}
            value={signUpData.user_name}
            onChange={(e) => handleSignUp(e)}
            fullWidth
          />

          <TextField
            className="mb-24"
            label="First Name"
            type="text"
            name="first_name"
            variant="outlined"
            required
            error={!!error.first_name}
            helperText={error.first_name}
            value={signUpData.first_name}
            onChange={(e) => handleSignUp(e)}
            fullWidth
          />

          <TextField
            className="mb-24"
            label="Last Name"
            type="text"
            name="last_name"
            variant="outlined"
            required
            error={!!error.last_name}
            helperText={error.last_name}
            value={signUpData.last_name}
            onChange={(e) => handleSignUp(e)}
            fullWidth
          />

          <TextField
            className="mb-24"
            label="Phone Number"
            type="number"
            variant="outlined"
            name="phone_number"
            required
            error={!!error.phone_number}
            helperText={error.phone_number}
            value={signUpData.phone_number}
            onChange={(e) => handleSignUp(e)}
            fullWidth
            inputProps={{
              min: 0,
            }}
          />

          <TextField
            className="mb-24"
            label="Email"
            type="email"
            name="email"
            variant="outlined"
            required
            error={!!error.email}
            helperText={error.email}
            value={signUpData.email}
            onChange={(e) => handleSignUp(e)}
            fullWidth
          />

          <TextField
            className="mb-24"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            error={!!error.password}
            helperText={
              error.password ? (
                <div dangerouslySetInnerHTML={{ __html: error.password }} />
              ) : null
            }
            variant="outlined"
            required
            value={signUpData.password}
            onChange={(e) => handleSignUp(e)}
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
            className="mb-24"
            label="Password (Confirm)"
            name="password_confirmation"
            variant="outlined"
            required
            type={showPasswordConfirmation ? "text" : "password"}
            error={!!error.password_confirmation}
            helperText={error.password_confirmation}
            value={signUpData.password_confirmation}
            onChange={(e) => handleSignUp(e)}
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

          <Button
            variant="contained"
            color="secondary"
            className="w-full mt-24"
            aria-label="Register"
            type="submit"
            size="large"
            onClick={() => createSAdmin()}
          >
            Create your free account
          </Button>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: "primary.light" }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-black">
            <div>Welcome to</div>
            <div>Chatbie</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-black">
            Lorem Ipsum es simplemente el texto de relleno de las imprentas y
            archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar
            de las industrias desde el año 1500, cuando un impresor (N. del T.
            persona que se dedica a la imprenta) desconocido usó una galería de
            textos y los mezcló de tal manera que logró hacer un libro de textos
            especimen. No sólo sobrevivió 500 años, sino que tambien ingresó
            como texto de relleno en documentos electrónicos, quedando
            esencialmente igual al original. Fue popularizado en los 60s con la
            creación de las hojas "Letraset", las cuales contenian pasajes de
            Lorem Ipsum, y más recientemente con software de autoedición, como
            por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem
            Ipsum.
          </div>
          {/* <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  borderColor: "primary.main",
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-black">
              More than 17k people joined us, it's your turn
            </div>
          </div> */}
        </div>
      </Box>
    </div>
  );
}

export default SignUpPage;
