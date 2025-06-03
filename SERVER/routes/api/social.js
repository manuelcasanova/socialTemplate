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
      const [globalResult, adminResult] = await Promise.all([
        pool.query(`
          SELECT 
            show_social_feature, 
            allow_follow, 
            allow_mute,
            show_messages_feature
          FROM global_provider_settings LIMIT 1;
        `),
        pool.query(`
          SELECT 
            show_social_feature, 
            allow_follow, 
            allow_mute,
            show_messages_feature
          FROM admin_settings LIMIT 1;
        `)
      ]);

      const global = globalResult.rows[0] || {};
      const admin = adminResult.rows[0] || {};

      // console.log('global', global)
      // console.log('admin', admin)

      const settings = {
        show_social_feature: global.show_social_feature && admin.show_social_feature,
        allow_follow: global.allow_follow && admin.allow_follow,
        allow_mute: global.allow_mute && admin.allow_mute,
        show_messages_feature: global.show_messages_feature && admin.show_messages_feature
      };

      // console.log('settings in middleware:', settings);

      const roles = await fetchRoles();
      // console.log('roles:', roles);

      let allowedRoles = [];

      if (!settings.show_social_feature && !settings.show_messages_feature) {
        allowedRoles = ['SuperAdmin'];
      } else {
        switch (action) {
          case 'follow':
            if (settings.allow_follow) {
              allowedRoles = roles;
            } else {
              allowedRoles = ['SuperAdmin'];
            }
            break;

          case 'mute':
            if (settings.allow_mute || settings.show_messages_feature) {
              allowedRoles = roles;
            } else {
              allowedRoles = ['SuperAdmin'];
            }
            break;

          default:
            allowedRoles = roles;
        }
      }

      // console.log('allowedRoles:', allowedRoles);
      // console.log(`Access check for action "${action}": allowedRoles =`, allowedRoles);

      return verifyRoles(...allowedRoles)(req, res, next);
    } catch (err) {
      console.error('Error checking social access:', err);
      next(err);
    }
  };
};


  // Define routes with corresponding access requirement
  const routes = [
    { path: '/users/all', method: 'get', handler: socialController.getAllUsers, access: 'default' },
    { path: '/users/username', method: 'get', handler: socialController.getUsernameByUserId, access: 'default' },
    //For users/muted change access: 'mute' if prefer to not show the list of muted users if settings allowMute is false
    { path: '/users/muted', method: 'get', handler: socialController.getMutedUsers, access: 'default' },
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