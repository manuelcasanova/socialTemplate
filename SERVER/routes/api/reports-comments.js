const express = require('express');
const router = express.Router();
const reportsCommentsController = require('../../controllers/reportsCommentsController')
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/comment-report')
  .get(
    async (req, res, next) => {
      try {
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
        verifyRoles('SuperAdmin', 'Moderator')(req, res, next);
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
        verifyRoles('Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.reportCommentOk
  );

router.route('/comment/ok/history')
  .post(
    async (req, res, next) => {
      try {
        verifyRoles('Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.addCommentReportHistory
  );

router.route('/has-reported')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.hasReported
  );

router.route('/reportcomment')
  .post(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.reportComment
  );

// Hide comment and mark as "Inappropriate"
router.route('/comment/inappropriate/:commentId')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.reportCommentInappropriate
  );

// Add history record when hiding comment
router.route('/comment/inappropriate/history')
  .post(
    async (req, res, next) => {
      try {
        verifyRoles('Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.addReportHistory
  );

router.route('/has-hidden')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.hasHidden
  );

router.route('/comment-report-history')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin', 'Moderator')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    reportsCommentsController.getCommentReportHistory
  );

module.exports = router;
