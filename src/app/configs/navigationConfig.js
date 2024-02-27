import i18next from "i18next";
import DocumentationNavigation from "../main/documentation/DocumentationNavigation";

import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import authRoles from "../auth/authRoles";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [
  {
    id: "apps",
    title: "Applications",
    auth: authRoles.admin,
    subtitle: "",
    type: "group",
    icon: "heroicons-outline:cube",
    translate: "APPLICATIONS",
    children: [
      {
        id: "apps.calendar",
        title: "Calendar",
        type: "item",
        icon: "heroicons-outline:calendar",
        url: "/appointments",
        translate: "CALENDAR",
      },

      {
        id: "apps.contact",
        title: "Patients",
        type: "item",
        auth: authRoles.staff,
        icon: "heroicons-outline:user-group",
        url: "/patients",
        translate: "Patients",
      },

      {
        id: "apps.contacts",
        title: "Users",
        type: "item",
        auth: authRoles.staff,
        icon: "heroicons-outline:user-group",
        url: "/users",
        translate: "USER",
      },
      {
        id: "apps.ecommerce",
        title: "Services",
        auth: authRoles.headStaff,
        type: "collapse",
        icon: "heroicons-outline:shopping-cart",
        translate: "ECOMMERCE",
        children: [
          {
            id: "services-products",
            title: "Services",
            type: "item",
            url: "services",
            end: true,
          },

          {
            id: "categories-products",
            title: "Categories",
            type: "item",
            url: "categories",
            end: true,
          },
        ],
      },

      "heroicons-outline:cloud",
    ],
  },
];

export default navigationConfig;
