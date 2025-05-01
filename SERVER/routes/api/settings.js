const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/global-provider')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.getGlobalProviderSettings
  );

  //Show posts feature
  router.route('/global-provider/toggleShowPostsFeature')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowPostsFeature
  );

// Allow User Post

router.route('/global-provider/toggleAllowUserPost')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowUserPost
  );

// Allow Admin Post

router.route('/global-provider/toggleAllowAdminPost')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowAdminPost
  );

// Allow Comments

router.route('/global-provider/toggleAllowComments')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowComments
  );

// Allow Post Reactions

router.route('/global-provider/toggleAllowPostReactions')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowPostReactions
  );

// Allow Comment Reactions

router.route('/global-provider/toggleAllowCommentReactions')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowCommentReactions
  );


module.exports = router;
