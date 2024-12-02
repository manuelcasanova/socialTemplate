const ROLES_LIST = require('../config/roles_list');
const { all } = require('../routes/api/users');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.roles;
    if (!userRoles) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    next();
  };
};

module.exports = verifyRoles;
