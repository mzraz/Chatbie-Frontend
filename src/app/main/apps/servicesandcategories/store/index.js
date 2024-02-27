import { combineReducers } from "@reduxjs/toolkit";
import category from "./categorySlice";
import categories from "./categoriesSlice";
import service from "./serviceSlice";
import services from "./servicesSlice";

const reducer = combineReducers({
  services,
  service,
  categories,
  category,
});

export default reducer;
