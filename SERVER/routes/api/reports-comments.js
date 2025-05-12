const express = require('express');
const router = express.Router();
const reportsCommentsController = require('../../controllers/reportsCommentsController')
const verifyRoles = require('../../middleware/verifyRoles');
const pool = require('../../config/db');


// Dynamic comment settings middleware
const checkCommentSettingAccess = (action, intendedRoles) => {
  return async (req, res, next) => {
    try {
      const settingsResult = await pool.query(`
        SELECT 
          allow_flag_comments,
          allow_delete_comments
        FROM global_provider_settings
        LIMIT 1;
      `);
      const settings = settingsResult.rows[0];

      const settingMap = {
        'flag': settings.allow_flag_comments,
        'delete': settings.allow_delete_comments
      };

      let allowedRoles = [];

      if (settingMap[action]) {
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
    checkCommentSettingAccess('flag', 'dynamic'),
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
    checkCommentSettingAccess('flag', 'dynamic'),
    reportsCommentsController.hasHidden
  );

router.route('/comment-report-history')
  .get(
    checkCommentSettingAccess('flag', ['SuperAdmin', 'Moderator']),
    reportsCommentsController.getCommentReportHistory
  );

module.exports = router;
