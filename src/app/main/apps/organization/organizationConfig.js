import { lazy } from "react";
import { authRoles } from "src/app/auth";

const OrganizationForm = lazy(() => import("./organizationForm"));

const OrganizationFormConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: "/projects/new",
      element: <OrganizationForm />,
    },
  ],
};

export default OrganizationFormConfig;
