const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const {fetchRoles} = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');
const multer = require('multer');

// Set up multer for file upload
const upload = multer({
  dest: 'tmp/', // Temporary storage location
  limits: {
    fileSize: 1 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('File is not an image'), false);
    }
    cb(null, true);
  },
});

router.route('/upload-profile-picture/:userId')
  .post(upload.single('profilePicture'), usersController.uploadProfilePicture);

router.route('/')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.getAllUsers
  );


  router.route('/:userId')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles(
        'Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_not_subscribed'
        // 'ForceError'
        )(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.getUserById
  );

  router.route('/subscriptions/status/:user_id')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    (req, res) => {
      usersController.getSubscriptionStatus(req, res);
    }
  );



// Update user information (any logged-in user can update their own info)
router.route('/update')
  .put(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.updateUser
  );

//Soft delete user account 
router.route('/softdelete/:userId')
  .put(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err); 
      }
    },
    usersController.softDeleteUser 
  );

//Hard delete user account
router.route('/harddelete/:userId')
  .delete(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.adminVersionSoftDeleteUser
  );

//Update roles (by admin)
router.route('/:user_id/roles')
  .put(
    async (req, res, next) => {
      try {
        verifyRoles('Admin', 'SuperAdmin')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.updateRoles 
  );

router.route('/subscribe')
  .post(
    async (req, res, next) => {
      try {
        // Fetch roles and verify them
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.subscribeUser
  );



module.exports = router;
