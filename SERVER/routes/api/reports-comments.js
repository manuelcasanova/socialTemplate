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

module.exports = router;
