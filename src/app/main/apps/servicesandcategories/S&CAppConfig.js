import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const Product = lazy(() => import("./service/Service"));
const Products = lazy(() => import("./services/Services"));
const Order = lazy(() => import("./category/Categories"));
const Orders = lazy(() => import("./categories/Category"));

const ServicesandCategoriesConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.headStaff,
  routes: [
    {
      path: "/services/",
      element: <Products />,
    },
    {
      path: "/services/:productId/*",
      element: <Product />,
    },
    {
      path: "/categories",
      element: <Orders />,
    },
    {
      path: "/categories/:productId/*",
      element: <Order />,
    },
  ],
};

export default ServicesandCategoriesConfig;
