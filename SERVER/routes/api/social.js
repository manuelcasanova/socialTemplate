const express = require('express');
const router = express.Router();
const socialController = require('../../controllers/socialController');
const { fetchRoles } = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');
const pool = require('../../config/db');

// Middleware factory to check social feature and specific permission
const checkSocialAccess = (action) => {
  return async (req, res, next) => {
    try {
      const result = await pool.query(`
        SELECT 
         show_social_feature, 
          allow_follow, 
          allow_mute, 
          show_posts_feature,
          show_messages_feature,
          allow_send_messages,
          allow_delete_messages
        FROM global_provider_settings LIMIT 1;
      `);

      const settings = result.rows[0];
      let allowedRoles = [];

      const roles = await fetchRoles();

      if (
        !settings.show_social_feature && !settings.show_posts_feature && !settings.show_messages_feature) {
        allowedRoles = ['SuperAdmin'];
      } else {
        if (action === 'mute' && settings.show_messages_feature) {
          allowedRoles = roles;
        } else {  
          switch (action) {
            case 'follow':
              allowedRoles = settings.allow_follow ? roles : ['SuperAdmin'];
              break;
            case 'mute':
              allowedRoles = settings.allow_mute ? roles : ['SuperAdmin'];
              break;
            default:
              allowedRoles = roles;
          }
        }
      }

        verifyRoles(...allowedRoles)(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };


  // Define routes with corresponding access requirement
  const routes = [
    { path: '/users/all', method: 'get', handler: socialController.getAllUsers, access: 'default' },
    { path: '/users/username', method: 'get', handler: socialController.getUsernameByUserId, access: 'default' },
    { path: '/users/muted', method: 'get', handler: socialController.getMutedUsers, access: 'mute' },
    { path: '/users/mute', method: 'post', handler: socialController.muteUser, access: 'mute' },
    { path: '/users/unmute', method: 'post', handler: socialController.unmuteUser, access: 'mute' },
    { path: '/users/followee', method: 'get', handler: socialController.getFolloweeData, access: 'follow' },
    { path: '/users/followers', method: 'get', handler: socialController.getFollowersData, access: 'follow' },
    { path: '/users/followersAndFollowee', method: 'get', handler: socialController.getFollowersAndFolloweeData, access: 'follow' },
    { path: '/users/pending', method: 'get', handler: socialController.getPendingSocialRequests, access: 'follow' },
    { path: '/users/follow', method: 'post', handler: socialController.followUser, access: 'follow' },
    { path: '/users/cancel-follow', method: 'delete', handler: socialController.cancelFollowRequest, access: 'follow' },
    { path: '/users/unfollow', method: 'delete', handler: socialController.unfollowUser, access: 'follow' },
    { path: '/users/approvefollower', method: 'post', handler: socialController.approveFollowRequest, access: 'follow' },
    { path: '/users/follownotifications', method: 'get', handler: socialController.getFollowNotifications, access: 'follow' },
    { path: '/users/with-messages', method: 'get', handler: socialController.getUsersWithMessages, access: 'default' },
  ];

  // Register routes with dynamic access control
  routes.forEach(({ path, method, handler, access }) => {
    router[method](path, checkSocialAccess(access), handler);
  });

  module.exports = router;