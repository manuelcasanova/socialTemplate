const express = require('express');
const router = express.Router();
const messagesController = require('../../controllers/messagesController')
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/all')
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
    messagesController.getMessagesById
  );

  // Route to send message
router.route('/send')
.post(
  async (req, res, next) => {

    try {

      const rolesList = await fetchRoles();

      const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

      const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Permission denied: Only registered users can request to follow a user.' });
      }

      // Pass the roles to the verifyRoles middleware (if additional verification is needed)
      verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);

    } catch (err) {
      next(err);
    }
  },
  messagesController.sendMessage
);

router.route('/getnewmessagesnotification')
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
    messagesController.getNewMessagesNotification
  );


module.exports = router;