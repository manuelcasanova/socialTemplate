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

        // Check if either Admin or SuperAdmin role exists in the list
        const requiredRoles = ['Admin', 'SuperAdmin'];
        const hasRequiredRole = requiredRoles.some(role => rolesList.includes(role));

        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Permission denied: Only Admin or SuperAdmin can access this' });
        }

        // Pass the roles to verifyRoles middleware
        verifyRoles('Admin', 'SuperAdmin')(req, res, next);
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


  router.route('/subscriptions/status/:user_id')
  .get(
    async (req, res, next) => {
      try {
        // Log the request path and parameters
        console.log("Received request for subscription status:", req.params);  // Logs { user_id: 'someUserId' }
        
        // Fetch roles and verify them
        const rolesList = await fetchRoles();
        console.log("Roles List:", rolesList);  // Log the rolesList to see what roles are being fetched

        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        console.error("Error during role verification:", err);  // Log any errors during role verification
        next(err);
      }
    },
    (req, res) => {
      const { user_id } = req.params;
      console.log("User ID from URL params:", user_id);  // Log user_id extracted from the URL

      // Call your controller to get the subscription status
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

//Delete user account
router.route('/delete/:userId')
  .put(
    async (req, res, next) => {
      try {
        // Fetch roles and verify them
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);
      } catch (err) {
        next(err); // Handle errors during role verification
      }
    },
    usersController.softDeleteUser // Controller function to handle user deletion
  );

//Update roles (by admin)
router.route('/:user_id/roles')
  .put(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next); // Make sure the user is authorized (admin check)
      } catch (err) {
        next(err);
      }
    },
    usersController.updateRoles // This will call your controller to update roles
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
