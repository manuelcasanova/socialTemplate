const express = require('express');
const router = express.Router();
const messagesController = require('../../controllers/messagesController');
const verifyRoles = require('../../middleware/verifyRoles');
const pool = require('../../config/db');

// Dynamically check the settings and roles for message-related routes
const checkMessageFeatureAccess = (action) => {
  return async (req, res, next) => {
    try {
      const settingsResult = await pool.query(`
        SELECT 
         show_social_feature, 
          show_messages_feature,
          allow_send_messages,
          allow_delete_messages
        FROM global_provider_settings
        LIMIT 1;
      `);

      const settings = settingsResult.rows[0];
      let allowedRoles = [];

      if (!settings.show_social_feature && !settings.show_messages_feature) {
        allowedRoles = ['SuperAdmin'];
      } else {
        switch (action) {
          case 'view':
            if (settings.show_messages_feature) {
              const rolesResult = await pool.query(`SELECT role_name FROM roles`);
              allowedRoles = rolesResult.rows.map(role => role.role_name);
            } else {
              allowedRoles = ['SuperAdmin'];
            }
            break;
          case 'send':
            if (settings.show_messages_feature && settings.allow_send_messages) {
              const rolesResult = await pool.query(`SELECT role_name FROM roles`);
              allowedRoles = rolesResult.rows.map(role => role.role_name);
            } else {
              allowedRoles = ['SuperAdmin'];
            }
            break;
          case 'delete':
            if (settings.show_messages_feature && settings.allow_delete_messages) {
              const rolesResult = await pool.query(`SELECT role_name FROM roles`);
              allowedRoles = rolesResult.rows.map(role => role.role_name);
            } else {
              allowedRoles = ['SuperAdmin'];
            }
            break;
          default:
            allowedRoles = ['SuperAdmin'];
        }
      }

      // Middleware composition: call verifyRoles and run it as middleware
      return verifyRoles(...allowedRoles)(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

router.route('/all')
  .get(
    checkMessageFeatureAccess('view'),
    messagesController.getMessagesById
  );

router.route('/send')
  .post(
    checkMessageFeatureAccess('send'),
    messagesController.sendMessage
  );

router.route('/getnewmessagesnotification')
  .get(
    checkMessageFeatureAccess('view'),
    messagesController.getNewMessagesNotification
  );

router.route('/:id')
  .put(
    checkMessageFeatureAccess('delete'),
    messagesController.markMessageAsDeleted
  );

module.exports = router;
