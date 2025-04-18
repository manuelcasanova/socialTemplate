const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');


// Route to get all posts (is_deleted = false)
router.route('/all')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }

        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.getAllPosts
  );

  router.route('/:postId')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }

        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.getPostsById
  );

// Route to get posts by a specific user (is_deleted = false)
// router.route('/user')
//   .get(
//     async (req, res, next) => {
//       try {
//         const rolesList = await fetchRoles();

//         // Define the roles that have permission to access this route
//         const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
//         const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

//         if (!hasRequiredRole) {
//           return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
//         }

//         // Pass the roles to verifyRoles middleware
//         verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
//       } catch (err) {
//         next(err);
//       }
//     },
//     postsController.getPostsById
//   );


// Route to mark a post as deleted (soft delete)
router.route('/delete/:id')
  .put(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        // Define the roles that have permission to access this route
        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this route.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.markPostAsDeleted
  );

// Route to mark a post as deleted (soft delete)
router.route('/send/')

  .post(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        // Define the roles that have permission to access this route
        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this route.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.writePost
  );

// Route to get posts reactions' count
router.route('/reactions/count')
  .get(
    async (req, res, next) => {
      try {
        // console.log("hit reactions/count route")
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }

        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.getPostReactionsCount
  );

  // Route to get posts comments reactions' count
router.route('/comments/reactions/count')
.get(
  async (req, res, next) => {
    try {
      // console.log("hit reactions/count route")
      const rolesList = await fetchRoles();

      const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
      const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
      }

      verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  postsController.getPostCommentsReactionsCount
);


  // Route to get posts comments' count
router.route('/comments/count')
.get(
  async (req, res, next) => {
    try {
      // console.log("hit comments/count route")
      const rolesList = await fetchRoles();

      const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
      const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
      }

      verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  postsController.getPostCommentsCount
);

  // Route to get posts comments
  router.route('/comments/data')
  .get(
    async (req, res, next) => {
      try {
        // console.log("hit comments/count route")
        const rolesList = await fetchRoles();
  
        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));
  
        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
        }
  
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.getPostComments
  );

// Route to mark a post as deleted (soft delete)
router.route('/comments/send')

  .post(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        // Define the roles that have permission to access this route
        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registered users have access to this route.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    postsController.writePostComment
  );

    // Route to get posts reactions
    router.route('/reactions/data')
    .get(
      async (req, res, next) => {
        try {
          // console.log("hit comments/count route")
          const rolesList = await fetchRoles();
    
          const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
          const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));
    
          if (!hasRequiredRole) {
            return res.status(403).json({ error: 'Permission denied: Only registered users have access to this list.' });
          }
    
          verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
        } catch (err) {
          next(err);
        }
      },
      postsController.getPostReactionsData
    );

    // Route to react to a post
router.route('/reactions/send')

.post(
  async (req, res, next) => {
    try {
      const rolesList = await fetchRoles();

      // Define the roles that have permission to access this route
      const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'];
      const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Permission denied: Only registered users have access to this route.' });
      }

      // Pass the roles to verifyRoles middleware
      verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  postsController.sendReaction
);

module.exports = router;
