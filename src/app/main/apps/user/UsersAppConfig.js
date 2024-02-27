import { lazy } from "react";
import ContactView from "./contact/UserView";
import ContactForm from "./contact/UserForm";
import { authRoles } from "src/app/auth";

const ContactsApp = lazy(() => import("./UsersApp"));

const ContactAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.staff,
  routes: [
    {
      path: "/users",
      element: <ContactsApp />,
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

export default ContactAppConfig;
