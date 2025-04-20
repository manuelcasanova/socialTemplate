const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reportsController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/reportpost')
  .post(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this action.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsController.reportPost
  );

  router.route('/has-reported')
  .get(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this action.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsController.hasReported
  );

module.exports = router;
