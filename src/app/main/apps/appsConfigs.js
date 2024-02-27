import CalendarAppConfig from "./calendar/CalendarAppConfig";
import ChatAppConfig from "./chat/ChatAppConfig";
// import ContactsAppConfig from "./customers/CustomersAppConfig";
import ServicesandCategoriesConfig from "./servicesandcategories/S&CAppConfig";
import ProfileAppConfig from "./profile/profileAppConfig";
import ContactAppConfig from "./user/UsersAppConfig";
import OrganizationFormConfig from "./organization/organizationConfig";
import CustomerAppConfig from "./customers/UsersAppConfig";

const appsConfigs = [
  CustomerAppConfig,
  CalendarAppConfig,
  ChatAppConfig,
  ServicesandCategoriesConfig,
  ContactAppConfig,
  ProfileAppConfig,
  OrganizationFormConfig,
];

export default appsConfigs;
