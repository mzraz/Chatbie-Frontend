import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectUser } from "app/store/userSlice";
import { Box } from "@mui/system";
import {
  selectFilteredContacts,
  selectSearchText,
  setContactsSearchText,
} from "./store/contactsSlice";

function ContactsHeader(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const searchText = useSelector(selectSearchText);
  const filteredData = useSelector(selectFilteredContacts);
  const filteredUpdatedData = filteredData.filter(
    (item) => item.status !== "Failed"
  );

  return (
    <div className="p-24 sm:p-32 w-full border-b-1">
      <div className="flex flex-col items-center sm:items-start">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
        >
          Patients
        </Typography>
        <Typography
          component={motion.span}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          delay={500}
          className="text-14 font-medium ml-2"
          color="text.secondary"
        >
          {`${filteredUpdatedData.length} Patients`}
        </Typography>
      </div>
      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center mt-16 -mx-8">
        <Box
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
        >
          <FuseSvgIcon color="action" size={20}>
            heroicons-outline:search
          </FuseSvgIcon>

          <Input
            placeholder="Search contacts"
            className="flex flex-1 px-16"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              "aria-label": "Search",
            }}
            onChange={(ev) => dispatch(setContactsSearchText(ev))}
          />
        </Box>
        {/* <FormControl
          style={{
            width: "175px",
            height: "50px",
          }}
        >
          <InputLabel id="demo-simple-select-label">
            Select User Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Select User Type"
          >
            <MenuItem value={10}>Admin</MenuItem>
            <MenuItem value={20}>Secretaries</MenuItem>
            <MenuItem value={30}>Providers</MenuItem>
          </Select>
        </FormControl> */}
        {user.role === "Manager" ? null : (
          <Button
            className="mx-8"
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to="new/edit"
          >
            <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
            <span className="mx-8">Add</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ContactsHeader;
