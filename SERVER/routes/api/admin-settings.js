const express = require('express');
const router = express.Router();
const adminSettingsController = require('../../controllers/adminSettingsController');
const { fetchRoles } = require('../../config/fetchRoles');
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
    adminSettingsController.getAdminSettings
  );

//Show posts feature
router.route('/global-provider/toggleShowPostsFeature')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    adminSettingsController.toggleShowPostsFeature
  );

// Allow User Post

router.route('/global-provider/toggleAllowUserPost')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowUserPost
  );

// Allow Admin Post

router.route('/global-provider/toggleAllowAdminPost')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowAdminPost
  );

// Allow Post Interactions

router.route('/global-provider/toggleAllowPostInteractions')

  .put(

    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowPostInteractions
  );


// Allow Comments

router.route('/global-provider/toggleAllowComments')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowComments
  );

// Allow Post Reactions

router.route('/global-provider/toggleAllowPostReactions')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowPostReactions
  );

// Allow Comment Reactions

router.route('/global-provider/toggleAllowCommentReactions')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowCommentReactions
  );

// Allow Delete Posts

router.route('/global-provider/toggleAllowDeletePosts')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowDeletePosts
  );

// Allow Flag Posts

router.route('/global-provider/toggleAllowFlagPosts')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowFlagPosts
  );

// Allow Delete Comments

router.route('/global-provider/toggleAllowDeleteComments')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowDeleteComments
  );

// Allow Flag Comments

router.route('/global-provider/toggleAllowFlagComments')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowFlagComments
  );

//Show messages feature

router.route('/global-provider/toggleShowMessagesFeature')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    adminSettingsController.toggleShowMessagesFeature
  );

// Allow Send Messages

router.route('/global-provider/toggleAllowSendMessages')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowSendMessages
  );

// Allow Delete Messages

router.route('/global-provider/toggleAllowDeleteMessages')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowDeleteMessages
  );

// Show Social Feature
router.route('/global-provider/toggleShowSocialFeature')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleShowSocialFeature
  );

// Allow Follow
router.route('/global-provider/toggleAllowFollow')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowFollow
  );

// Allow Mute
router.route('/global-provider/toggleAllowMute')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowMute
  );


// Show profile feature
router.route('/global-provider/toggleShowProfileFeature')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleShowProfileFeature
  );

// Allow Edit username
router.route('/global-provider/toggleAllowEditUsername')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowEditUsername
  );

// Allow Edit email
router.route('/global-provider/toggleAllowEditEmail')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowEditEmail
  );

// Allow Edit password
router.route('/global-provider/toggleAllowEditPassword')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowEditPassword
  );


// Allow Delete my user
router.route('/global-provider/toggleAllowDeleteMyUser')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowDeleteMyUser
  );


// Allow Edit profile image
router.route('/global-provider/toggleAllowModifyProfilePicture')
  .put(
    (req, res, next) => verifyRoles('Admin', 'SuperAdmin')(req, res, next),
    adminSettingsController.toggleAllowModifyProfilePicture
  );


module.exports = router;
