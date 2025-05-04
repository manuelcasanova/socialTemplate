const express = require('express');
const router = express.Router();
const socialController = require('../../controllers/socialController');
const {fetchRoles} = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');


const withRoleVerification = async (req, res, next) => {
  try {
    const rolesList = await fetchRoles();
    verifyRoles(...rolesList)(req, res, next);
  } catch (err) {
    next(err);
  }
};

const routes = [
  { path: '/users/all', method: 'get', handler: socialController.getAllUsers },
  { path: '/users/username', method: 'get', handler: socialController.getUsernameByUserId },
  { path: '/users/muted', method: 'get', handler: socialController.getMutedUsers },
  { path: '/users/mute', method: 'post', handler: socialController.muteUser },
  { path: '/users/unmute', method: 'post', handler: socialController.unmuteUser },
  { path: '/users/followee', method: 'get', handler: socialController.getFolloweeData },
  { path: '/users/followers', method: 'get', handler: socialController.getFollowersData },
  { path: '/users/followersAndFollowee', method: 'get', handler: socialController.getFollowersAndFolloweeData },
  { path: '/users/pending', method: 'get', handler: socialController.getPendingSocialRequests },
  { path: '/users/follow', method: 'post', handler: socialController.followUser },
  { path: '/users/cancel-follow', method: 'delete', handler: socialController.cancelFollowRequest },
  { path: '/users/unfollow', method: 'delete', handler: socialController.unfollowUser },
  { path: '/users/approvefollower', method: 'post', handler: socialController.approveFollowRequest },
  { path: '/users/follownotifications', method: 'get', handler: socialController.getFollowNotifications },
  { path: '/users/with-messages', method: 'get', handler: socialController.getUsersWithMessages },
];

routes.forEach(({ path, method, handler }) => {
  router[method](path, withRoleVerification, handler);
});

module.exports = router;
