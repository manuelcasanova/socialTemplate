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

// Route to fetch followee data
router.route('/users/followee')
  .get(
    async (req, res, next) => {


      try {

        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }


        // Pass the roles to the verifyRoles middleware (if additional verification is needed)
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    socialController.getFolloweeData
  );

// Route to fetch followers data
router.route('/users/followers')
  .get(
    async (req, res, next) => {


      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }


        // Pass the roles to the verifyRoles middleware (if additional verification is needed)
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    socialController.getFollowersData
  );

// Route to fetch followers data
router.route('/users/followersAndFollowee')
  .get(
    async (req, res, next) => {


      try {

        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }

        // Pass the roles to the verifyRoles middleware (if additional verification is needed)
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);

      } catch (err) {
        next(err);
      }
    },
    socialController.getFollowersAndFolloweeData
  );

// Route to fetch pending requests data
router.route('/users/pending')
  .get(
    async (req, res, next) => {


      try {

        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }

        // Pass the roles to the verifyRoles middleware (if additional verification is needed)
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);

      } catch (err) {
        next(err);
      }
    },
    socialController.getPendingSocialRequests
  );


// Route to follow user
router.route('/users/follow')
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
    socialController.followUser
  );

module.exports = router;
