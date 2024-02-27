import { lazy } from "react";

const CalendarApp = lazy(() => import("./CalendarApp"));

const CalendarAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/appointments",
      element: <CalendarApp />,
    },
  ],
};

export default CalendarAppConfig;
