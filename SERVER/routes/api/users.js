const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');
const multer = require('multer');

// Set up multer for file upload
const upload = multer({
  dest: 'tmp/', // Temporary storage location
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
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
        const rolesList = await fetchRoles();
        verifyRoles(rolesList.find(role => role === 'Admin'))(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.getAllUsers
  );

router.route('/:user_id')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    (req, res) => {
      const { user_id } = req.params;
      usersController.getUserById(req, res);
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

  //Delete user account
  router.route('/delete/:userId')
  .delete(
    async (req, res, next) => {
      try {
        // Fetch roles and verify them
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err); // Handle errors during role verification
      }
    },
    usersController.deleteUser // Controller function to handle user deletion
  );


module.exports = router;
