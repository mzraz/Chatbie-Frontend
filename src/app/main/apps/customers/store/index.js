import { combineReducers } from "@reduxjs/toolkit";

import customers from "./contactsSlice";
import contact from "./userSlice";

const reducer = combineReducers({
  customers,
  contact,
});

export default reducer;
