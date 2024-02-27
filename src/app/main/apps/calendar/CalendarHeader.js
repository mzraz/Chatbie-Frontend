import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { openNewEventDialog } from "./store/eventsSlice";
import CalendarViewMenu from "./CalendarViewMenu";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { useState } from "react";
import { selectUser } from "app/store/userSlice";

function CalendarHeader(props) {
  const {
    calendarRef,
    currentDate,
    onToggleLeftSidebar,
    userAllData,
    setIdToFilterAppointments,
  } = props;
  const [filterAppointments, setFilterApppointments] =
    useState("All Appointments");
  const user = useSelector(selectUser);

  const mainTheme = useSelector(selectMainTheme);
  const calendarApi = () => calendarRef.current?.getApi();
  const dispatch = useDispatch();

  const handleFilteredAppointments = (e) => {
    const value = e.target.value.split(".")[0];
    const roleType = e.target.value.split(".")[1];

    if (roleType === "Service") {
      const findServiceData = userAllData.services.find(
        (item) => item.name === value
      );
      setIdToFilterAppointments(findServiceData);
    } else if (roleType === "Provider") {
      const findProviderData = userAllData.providers.find(
        (item) => item.user_name === value
      );
      setIdToFilterAppointments(findProviderData);
    } else {
      setIdToFilterAppointments("All Appointments");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full p-12 justify-between z-10 container">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex items-center">
          <Typography className="text-2xl font-semibold tracking-tight whitespace-nowrap mx-16">
            {currentDate?.view.title}
          </Typography>
        </div>

        <div className="flex items-center">
          <Tooltip title="Previous">
            <IconButton
              aria-label="Previous"
              onClick={() => calendarApi().prev()}
            >
              <FuseSvgIcon size={20}>
                {mainTheme.direction === "ltr"
                  ? "heroicons-solid:chevron-left"
                  : "heroicons-solid:chevron-right"}
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Next">
            <IconButton aria-label="Next" onClick={() => calendarApi().next()}>
              <FuseSvgIcon size={20}>
                {mainTheme.direction === "ltr"
                  ? "heroicons-solid:chevron-right"
                  : "heroicons-solid:chevron-left"}
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>

          <Tooltip title="Today">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                <IconButton
                  aria-label="today"
                  onClick={() => calendarApi().today()}
                  size="large"
                >
                  <FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
                </IconButton>
              </motion.div>
            </div>
          </Tooltip>
        </div>
      </div>

      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
      >
        <IconButton
          className="mx-8"
          aria-label="add"
          onClick={(ev) =>
            dispatch(
              openNewEventDialog({
                jsEvent: ev,
                start: new Date(),
                end: new Date(),
              })
            )
          }
        >
          <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
        </IconButton>
        <FormControl
          style={{
            width: "269px",
            height: "42px",
            margin: "0px 2px",
          }}
        >
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label=""
            defaultValue={filterAppointments}
            onChange={(e) => handleFilteredAppointments(e)}
          >
            <MenuItem value={"All Appointments"}>All Appointments</MenuItem>
            <MenuItem disabled>
              <strong>Providers</strong>
            </MenuItem>
            {userAllData?.providers?.map((item) => (
              <MenuItem value={`${item.user_name}.Provider`}>
                {item.user_name}
              </MenuItem>
            ))}
            <MenuItem disabled>
              <strong>Services</strong>
            </MenuItem>
            {userAllData?.services?.map((item) => (
              <MenuItem value={`${item.name}.Service`}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <CalendarViewMenu currentDate={currentDate} calendarApi={calendarApi} />
      </motion.div>
    </div>
  );
}

export default CalendarHeader;
