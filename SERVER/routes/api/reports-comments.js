const express = require('express');
const router = express.Router();
const reportsCommentsController = require('../../controllers/reportsCommentsController');
const verifyRoles = require('../../middleware/verifyRoles');
const pool = require('../../config/db');

// Dynamic comment settings middleware with dual-source validation
const checkCommentSettingAccess = (action, intendedRoles, options = {}) => {
  return async (req, res, next) => {
    try {
      const [globalResult, adminResult] = await Promise.all([
        pool.query(`
          SELECT 
            allow_flag_comments,
            allow_delete_comments
          FROM global_provider_settings
          LIMIT 1;
        `),
        pool.query(`
          SELECT 
            allow_flag_comments,
            allow_delete_comments
          FROM admin_settings
          LIMIT 1;
        `)
      ]);

      const global = globalResult.rows[0];
      const admin = adminResult.rows[0];

      const featureEnabled = (feature) => {
        return global[feature] && admin[feature];
      };

      const settingMap = {
        'flag': featureEnabled('allow_flag_comments'),
        'delete': featureEnabled('allow_delete_comments')
      };

      let allowedRoles = [];

      if (settingMap[action] || options.alwaysAllow) {
        if (intendedRoles === 'dynamic') {
          const rolesResult = await pool.query(`SELECT role_name FROM roles`);
          allowedRoles = rolesResult.rows.map(role => role.role_name);
        } else {
          allowedRoles = intendedRoles;
        }
      } else {
        allowedRoles = ['SuperAdmin'];
      }

      verifyRoles(...allowedRoles)(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// Routes
router.route('/comment-report')
  .get(
    checkCommentSettingAccess('flag', ['SuperAdmin', 'Moderator']),
    reportsCommentsController.getCommentReport
  );

router.route('/hidden-comments')
  .get(
    checkCommentSettingAccess('flag', ['SuperAdmin', 'Moderator']),
    reportsCommentsController.getHiddenComments
  );

router.route('/comment/ok/:commentId')
  .put(
    checkCommentSettingAccess('flag', ['Moderator']),
    reportsCommentsController.reportCommentOk
  );

router.route('/comment/ok/history')
  .post(
    checkCommentSettingAccess('flag', ['Moderator']),
    reportsCommentsController.addCommentReportHistory
  );

router.route('/has-reported')
  .get(
    checkCommentSettingAccess('flag', 'dynamic', { alwaysAllow: true }),
    reportsCommentsController.hasReported
  );

// Report comment and mark as "Reported"
router.route('/reportcomment')
  .post(
    checkCommentSettingAccess('flag', 'dynamic'),
    reportsCommentsController.reportComment
  );

// Hide comment and mark as "Inappropriate"
router.route('/comment/inappropriate/:commentId')
  .put(
    checkCommentSettingAccess('flag', ['Moderator']),
    reportsCommentsController.reportCommentInappropriate
  );

// Add history record when hiding comment
router.route('/comment/inappropriate/history')
  .post(
    checkCommentSettingAccess('flag', ['Moderator']),
    reportsCommentsController.addReportHistory
  );

router.route('/has-hidden')
  .get(
    checkCommentSettingAccess('flag', 'dynamic', { alwaysAllow: true }),
    reportsCommentsController.hasHidden
  );

router.route('/comment-report-history')
  .get(
    checkCommentSettingAccess('flag', ['Moderator']),
    reportsCommentsController.getCommentReportHistory
  );

module.exports = router;
