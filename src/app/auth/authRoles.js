/**
 * Authorization Roles
 */
const authRoles = {
  admin: ["SuperAdmin", "Admin", "Manager", "Provider"],
  headStaff: ["SuperAdmin", "Admin"],
  staff: ["SuperAdmin", "Admin", "Manager"],
  onlyManager: ["Manager"],
  onlyProvider: ["Provider"],
  onlyGuest: [],
};

export default authRoles;
