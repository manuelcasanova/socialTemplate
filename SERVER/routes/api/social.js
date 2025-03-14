const express = require('express');
const router = express.Router();
const socialController = require('../../controllers/socialController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/users/all')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this list.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    socialController.getAllUsers
  );

  router.route('/users/muted')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this list.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    socialController.getMutedUsers
  );

router.route('/users/mute')
.post(
  async (req, res, next) => {
    try {
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
  socialController.muteUser
);

router.route('/users/unmute')
.post(
  async (req, res, next) => {
    try {
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
  socialController.unmuteUser
);


module.exports = router;
