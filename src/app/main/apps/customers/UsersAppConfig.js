import { lazy } from "react";
import ContactView from "./contact/UserView";
import ContactForm from "./contact/UserForm";
import { authRoles } from "src/app/auth";

const CustomersApp = lazy(() => import("./UsersApp"));

const CustomerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.staff,
  routes: [
    {
      path: "/patients",
      element: <CustomersApp />,
      children: [
        {
          path: ":id",
          element: <ContactView />,
        },
        {
          path: ":id/edit",
          element: <ContactForm />,
        },
      ],
    },
  ],
};

export default CustomerAppConfig;
