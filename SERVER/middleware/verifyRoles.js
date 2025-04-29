const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.roles;
    if (!userRoles) {
      return res.status(403).json({ message: 'Access Denied' });
    }
// console.log("userRoles", userRoles)
// console.log("allowedRoles", allowedRoles)

    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    next();
  };
};

module.exports = verifyRoles;
