import { motion } from "framer-motion";
import { Checkbox, IconButton } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import {
  openLabelsDialog,
  selectLabels,
  selectSelectedLabels,
  toggleSelectedLabels,
} from "./store/labelsSlice";
import { Autocomplete, TextField } from "@mui/material";

function CalendarAppSidebar() {
  const labels = useSelector(selectLabels);
  const selectedLabels = useSelector(selectSelectedLabels);
  const dispatch = useDispatch();
  const options = [
    { label: "The Godfather", id: 1 },
    { label: "Pulp Fiction", id: 2 },
  ];
  return (
    <div className="flex flex-col flex-auto min-h-full p-32">
      <h1>Providers</h1>
      <Autocomplete
        style={{
          width: "90%",
        }}
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Providers" />}
      />
      <h1>Services</h1>
      <Autocomplete
        style={{
          width: "90%",
        }}
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Services" />}
      />
    </div>
  );
}

export default CalendarAppSidebar;
