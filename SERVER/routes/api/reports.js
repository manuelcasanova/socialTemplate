const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reportsController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/reportpost')
  .post(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
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
    reportsController.reportPost
  );

  router.route('/has-reported')
  .get(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
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
    reportsController.hasReported
  );

  router.route('/has-hidden')
  .get(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
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
    reportsController.hasHidden
  );

  router.route('/hidden-posts')
  .get(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
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
    reportsController.getHiddenPosts
  );

  router.route('/post-report-history')
  .get(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
        const rolesList = await fetchRoles();

        const requiredRoles = ['Admin', 'SuperAdmin', 'Moderator'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this action.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin', 'Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsController.getPostReportHistory
  );

  router.route('/post-report')
  .get(
    async (req, res, next) => {
      try {
        // console.log("reports.js")
        const rolesList = await fetchRoles();

        const requiredRoles = ['SuperAdmin', 'Moderator'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this action.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('SuperAdmin', 'Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsController.getPostReport
  );

  router.route('/post/ok/:postId')
  .put(
    async (req, res, next) => {
      try {

        const rolesList = await fetchRoles();

        const requiredRoles = ['Moderator'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only registed users have access to this action.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Moderator')(req, res, next);

      } catch (err) {
        next(err);
      }
    },
    reportsController.reportPostOk
  );

  router.route('/post/ok/history')
  .post(
    async (req, res, next) => {
      try {
        // Check for roles before proceeding
        const rolesList = await fetchRoles();

        const requiredRoles = ['Moderator'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only moderators can add history.' });
        }

        // If roles match, proceed with the next middleware (i.e. controller)
        next();
      } catch (err) {
        next(err); // Catch any errors and forward to error handler
      }
    },
    reportsController.addReportHistory // The controller that handles adding the history record
  );

// Hide post and mark as "Inappropriate"
router.route('/post/inappropriate/:postId')
  .put(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Moderator'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only moderators can hide posts.' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Moderator')(req, res, next);

      } catch (err) {
        next(err);
      }
    },
    reportsController.reportPostInappropriate 
  );

// Add history record when hiding post
router.route('/post/inappropriate/history')
  .post(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();

        const requiredRoles = ['Moderator'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only moderators can add history.' });
        }

        next(); 
      } catch (err) {
        next(err);
      }
    },
    reportsController.addReportHistory 
  );


module.exports = router;
