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

// Route to cancel follow request
router.route('/users/cancel-follow')
  .delete(
    async (req, res, next) => {
      try {

        // Fetch the user's roles (you might already have logic for this)
        const rolesList = await fetchRoles();
        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];

        // Check if the user has the required roles
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users can cancel a follow request.' });
        }

        // Ensure the user is logged in and has permission to perform this action
        const { followeeId, followerId, user } = req.body;
        if (!user || user.userId !== followerId) {
          return res.status(403).json({ error: 'Permission denied: You can only cancel your own follow requests.' });
        }

        // Now call the controller and pass the entire req object
        await socialController.cancelFollowRequest(req, res, next);

      } catch (err) {
        next(err);
      }
    }
  );

// Route to unfollow user
router.route('/users/unfollow')
  .delete(
    async (req, res, next) => {
      try {

        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          console.log("User does not have required roles.");
          return res.status(403).json({ error: 'Permission denied: Only registered users can request to unfollow a user.' });
        }
        const { followeeId, followerId, user } = req.body;
 
        if (!user || user.userId !== followerId) {
          console.log("User is not authorized to unfollow.");
          return res.status(403).json({ error: 'Permission denied: You can only unfollow your own follow requests.' });
        }

        await socialController.unfollowUser(req, res, next);
      } catch (err) {
        next(err); // Pass any errors to the error handler
      }
    }
  );

  // Route to approve a follow request
router.route('/users/approvefollower')
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
  socialController.approveFollowRequest
);

// Route to fetch pending requests data
router.route('/users/follownotifications')
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
    socialController.getFollowNotifications
  );

  router.route('/users/with-messages')
  .get(
    async (req, res, next) => {
      try {
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        // Proceed to controller method
        socialController.getUsersWithMessages(req, res);
      } catch (err) {
        next(err);
      }
    }
  );



module.exports = router;
