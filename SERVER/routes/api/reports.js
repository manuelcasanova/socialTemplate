const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reportsController');
const pool = require('../../config/db');
const {fetchRoles} = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

// Inline middleware to check access based on allow_flag_posts
const checkPostReportAccess = (action, intendedRoles = 'dynamic') => {
  return async (req, res, next) => {
    try {
      const result = await pool.query(`
        SELECT allow_flag_posts FROM global_provider_settings LIMIT 1;
      `);
      const settings = result.rows[0];

      const settingEnabled = settings.allow_flag_posts;

      let allowedRoles = [];

      if (settingEnabled) {
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
      next(err);
    }
  };
};

router.post('/reportpost', checkPostReportAccess('flag'), reportsController.reportPost);
router.get('/has-reported', checkPostReportAccess('flag'), reportsController.hasReported);
router.get('/has-hidden', checkPostReportAccess('flag'), reportsController.hasHidden);
router.get('/hidden-posts', checkPostReportAccess('flag'), reportsController.getHiddenPosts);

// Moderator/SuperAdmin routes
router.get('/post-report-history', checkPostReportAccess('flag', ['SuperAdmin', 'Moderator']), reportsController.getPostReportHistory);
router.get('/post-report', checkPostReportAccess('flag', ['Moderator']), reportsController.getPostReport);
router.put('/post/ok/:postId', checkPostReportAccess('flag', ['Moderator']), reportsController.reportPostOk);
router.post('/post/ok/history', checkPostReportAccess('flag', ['Moderator']), reportsController.addReportHistory);
router.put('/post/inappropriate/:postId', checkPostReportAccess('flag', ['Moderator']), reportsController.reportPostInappropriate);
router.post('/post/inappropriate/history', checkPostReportAccess('flag', ['Moderator']), reportsController.addReportHistory);


module.exports = router;
