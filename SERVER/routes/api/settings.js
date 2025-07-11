const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
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

// Allow Post Interactions

router.route('/global-provider/toggleAllowPostInteractions')

  .put(

    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowPostInteractions
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

// Allow Delete Posts

router.route('/global-provider/toggleAllowDeletePosts')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowDeletePosts
  );

// Allow Flag Posts

router.route('/global-provider/toggleAllowFlagPosts')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowFlagPosts
  );

// Allow Delete Comments

router.route('/global-provider/toggleAllowDeleteComments')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowDeleteComments
  );

// Allow Flag Comments

router.route('/global-provider/toggleAllowFlagComments')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowFlagComments
  );

//Show messages feature

router.route('/global-provider/toggleShowMessagesFeature')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowMessagesFeature
  );

// Allow Send Messages

router.route('/global-provider/toggleAllowSendMessages')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowSendMessages
  );

// Allow Delete Messages

router.route('/global-provider/toggleAllowDeleteMessages')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowDeleteMessages
  );

// Show Social Feature
router.route('/global-provider/toggleShowSocialFeature')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleShowSocialFeature
  );

// Allow Follow
router.route('/global-provider/toggleAllowFollow')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowFollow
  );

// Allow Mute
router.route('/global-provider/toggleAllowMute')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowMute
  );

// Allow Manage Roles (Admin)
router.route('/global-provider/toggleAllowManageRoles')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowManageRoles
  );

// Allow Delete Users (Admin)
router.route('/global-provider/toggleAllowDeleteUsers')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowDeleteUsers
  );

// Show profile feature
router.route('/global-provider/toggleShowProfileFeature')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleShowProfileFeature
  );

// Allow Edit username
router.route('/global-provider/toggleAllowEditUsername')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowEditUsername
  );

// Allow Edit email
router.route('/global-provider/toggleAllowEditEmail')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowEditEmail
  );

// Allow Edit password
router.route('/global-provider/toggleAllowEditPassword')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowEditPassword
  );


// Allow Delete my user
router.route('/global-provider/toggleAllowDeleteMyUser')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowDeleteMyUser
  );


// Allow Edit profile image
router.route('/global-provider/toggleAllowModifyProfilePicture')
  .put(
    (req, res, next) => verifyRoles('SuperAdmin')(req, res, next),
    settingsController.toggleAllowModifyProfilePicture
  );

//Show subscriber feature
router.route('/global-provider/toggleShowSubscriberFeature')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowSubscriberFeature
  );


//Show admin custom roles feature
router.route('/global-provider/toggleShowCustomRolesFeature')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowCustomRolesFeature
  );

//Allow Admin Create Custom Role
router.route('/global-provider/toggleAllowAdminCreateCustomRole')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleAllowAdminCreateCustomRole
  );

//Allow Admin Edit Custom Role
router.route('/global-provider/toggleAllowAdminEditCustomRole')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleAllowAdminEditCustomRole
  );

  //Allow Admin Delete Custom Role
router.route('/global-provider/toggleAllowAdminDeleteCustomRole')
.put(
  async (req, res, next) => {
    try {
      verifyRoles('SuperAdmin')(req, res, next);
    } catch (err) {
      next(err);
    }
  },
  settingsController.toggleAllowAdminDeleteCustomRole
);

//Superadmin visibility
router.route('/global-provider/toggleShowSuperAdminInUsersAdmin')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowSuperAdminInUsersAdmin
  );

  router.route('/global-provider/toggleShowSuperAdminInSocial')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowSuperAdminInSocial
  );

  router.route('/global-provider/toggleShowSuperAdminInLoginHistory')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    settingsController.toggleShowSuperAdminInLoginHistory
  );


module.exports = router;
