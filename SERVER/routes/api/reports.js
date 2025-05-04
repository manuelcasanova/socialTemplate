const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/reportsController');
const {fetchRoles} = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/reportpost')
  .post(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
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
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
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
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
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
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
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
        verifyRoles('SuperAdmin', 'Moderator')(req, res, next);
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
        verifyRoles('Moderator')(req, res, next);
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
        verifyRoles('Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsController.addReportHistory // The controller that handles adding the history record
  );

// Hide post and mark as "Inappropriate"
router.route('/post/inappropriate/:postId')
  .put(
    async (req, res, next) => {
      try {
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
        verifyRoles('Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsController.addReportHistory
  );


module.exports = router;
