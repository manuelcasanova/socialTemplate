// middleware/verifyRoles.js
const ROLES_LIST = require('../config/roles_list');  // Ensure this path is correct

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    // console.log("req.roles", req.roles);  // e.g., [ 'User_not_subscribed', 'User_subscribed', 'Moderator', 'Admin' ]
    // console.log("allowedRoles", allowedRoles);  // e.g., [ 4 ] (Role ID for Admin)

    // Map allowedRole IDs to role names using ROLES_LIST
    const allowedRoleNames = allowedRoles.map(roleId => {
      // Find the role name for the given role ID
      const roleName = Object.keys(ROLES_LIST).find(key => ROLES_LIST[key] === roleId);
      return roleName ? roleName.toLowerCase() : null;  // Convert to lowercase
    }).filter(roleName => roleName !== null);  // Filter out null values if role ID doesn't exist

    // console.log("Mapped Allowed Role Names:", allowedRoleNames);  // e.g., [ 'admin' ]

    // Normalize req.roles to lowercase and check if any of the user's roles match the allowed roles
    const result = req.roles
      .map(role => role.toLowerCase())  // Convert req.roles to lowercase
      .some(role => allowedRoleNames.includes(role));  // Check if any match

    // console.log("result", result);  // true or false

    if (!result) return res.sendStatus(401);  // Unauthorized if no match

    next();  // Proceed to the next middleware if authorized
  };
};

module.exports = verifyRoles;
