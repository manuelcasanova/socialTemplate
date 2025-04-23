const express = require('express');
const router = express.Router();
const reportsCommentsController = require('../../controllers/reportsCommentsController')
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/comment-report')
.get(
  async (req, res, next) => {
    try {
      // console.log('hit reports-comments.js')
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
  reportsCommentsController.getCommentReport
);

router.route('/hidden-comments')
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
  reportsCommentsController.getHiddenComments
);

router.route('/comment/ok/:commentId')
  .put(
    async (req, res, next) => {
      try {
        console.log("reports-comments hit comment/ok/:commentId");

        const rolesList = await fetchRoles();
        req.roles = rolesList; // 🔑 Attach roles to the request object

        next(); // 🔥 Pass control to the next middleware (verifyRoles)
      } catch (err) {
        next(err); // Pass errors to Express error handler
      }
    },
    verifyRoles('Moderator'), // ✅ Now used properly as middleware
    reportsCommentsController.reportCommentOk // ✅ Your controller
  );

  router.route('/comment/ok/history')
  .post(
    async (req, res, next) => {
      try {
        console.log("reports-comments comment/ok/history")
        // Check for roles before proceeding
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
    reportsCommentsController.addCommentReportHistory 
  );

module.exports = router;
