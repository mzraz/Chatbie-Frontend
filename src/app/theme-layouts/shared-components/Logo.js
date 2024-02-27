import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme }) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  return (
    <Root className="flex items-center">
      {/* <img
        className="logo-icon w-32 h-32"
        src="assets/images/logo/logo.svg"
        alt="logo"
      /> */}

      <div
        className="badge flex items-center py-4 px-8 mx-8 rounded"
        style={{ backgroundColor: "#fcf8f5", color: "#61DAFB" }}
      >
        <img
          className="react-badge"
          style={{
            height: "188px",
            width: "475px",
          }}
          src="https://i.ibb.co/M1q987X/7ezu3a8btislmt7vy70.png"
          alt="react"
          // width="30"
        />
        {/* <h1>hatBie</h1> */}
        {/* <span className="react-text text-12 mx-4">React</span> */}
      </div>
    </Root>
  );
}

export default Logo;
