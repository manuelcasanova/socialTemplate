const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reportsController');
const pool = require('../../config/db');
const {fetchRoles} = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

// Inline middleware to check access based on allow_flag_posts
const checkPostReportAccess = (action, intendedRoles = 'dynamic', options = {}) => {
  return async (req, res, next) => {
    try {
      // Query both settings based on the action
      const globalResult = await pool.query(`SELECT ${action} FROM global_provider_settings LIMIT 1;`);
      const adminResult = await pool.query(`SELECT ${action} FROM admin_settings LIMIT 1;`);

      const globalSetting = globalResult.rows[0]?.[action] ?? false;
      const adminSetting = adminResult.rows[0]?.[action] ?? false;

      const settingEnabled = globalSetting && adminSetting;

      // console.log(`[checkPostReportAccess] action=${action}, global=${globalSetting}, admin=${adminSetting}`);

      let allowedRoles = [];

      if (settingEnabled || options.alwaysAllow ) {
        if (intendedRoles === 'dynamic') {
          const roles = await fetchRoles();
          allowedRoles = roles;
        } else {
          allowedRoles = intendedRoles;
        }
      } else {
        allowedRoles = ['SuperAdmin'];
      }

      verifyRoles(...allowedRoles)(req, res, next);
    } catch (err) {
      console.error('checkPostReportAccess error:', err.message);
      next(err);
    }
  };
};


router.post('/reportpost', checkPostReportAccess('allow_flag_posts'), reportsController.reportPost);
router.get('/has-reported', checkPostReportAccess('allow_flag_posts', 'dynamic', { alwaysAllow: true }), reportsController.hasReported);
router.get('/has-hidden', checkPostReportAccess('allow_flag_posts', 'dynamic', { alwaysAllow: true }), reportsController.hasHidden);
router.get('/hidden-posts', checkPostReportAccess('allow_flag_posts', 'dynamic', { alwaysAllow: true }), reportsController.getHiddenPosts);

// Moderator routes
router.get('/post-report-history', checkPostReportAccess('allow_flag_posts', ['Moderator']), reportsController.getPostReportHistory);
router.get('/post-report', checkPostReportAccess('allow_flag_posts', ['Moderator']), reportsController.getPostReport);
router.put('/post/ok/:postId', checkPostReportAccess('allow_flag_posts', ['Moderator']), reportsController.reportPostOk);
router.post('/post/ok/history', checkPostReportAccess('allow_flag_posts', ['Moderator']), reportsController.addReportHistory);
router.put('/post/inappropriate/:postId', checkPostReportAccess('allow_flag_posts', ['Moderator']), reportsController.reportPostInappropriate);
router.post('/post/inappropriate/history', checkPostReportAccess('allow_flag_posts', ['Moderator']), reportsController.addReportHistory);

module.exports = router;
