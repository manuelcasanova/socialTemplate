const express = require('express');
const router = express.Router();
const messagesController = require('../../controllers/messagesController');
const verifyRoles = require('../../middleware/verifyRoles');

const allowedRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

const verifyRolesMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      await verifyRoles(...roles)(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

router.route('/all')
  .get(
    verifyRolesMiddleware(allowedRoles),
    messagesController.getMessagesById
  );

router.route('/send')
  .post(
    verifyRolesMiddleware(allowedRoles),
    messagesController.sendMessage
  );

router.route('/getnewmessagesnotification')
  .get(
    verifyRolesMiddleware(allowedRoles),
    messagesController.getNewMessagesNotification
  );

router.route('/:id')
  .put(
    verifyRolesMiddleware(allowedRoles),
    messagesController.markMessageAsDeleted
  );

module.exports = router;
