const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const { fetchRoles } = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');
const multer = require('multer');
const pool = require('../../config/db')

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

// Modify profile picture route with permission check
router.route('/upload-profile-picture/:userId')
  .post(
    async (req, res, next) => {
      try {
        const [globalResult, adminResult] = await Promise.all([
          pool.query(`SELECT allow_modify_profile_picture FROM global_provider_settings LIMIT 1;`),
          pool.query(`SELECT allow_modify_profile_picture FROM admin_settings LIMIT 1;`)
        ]);

        const globalAllow = globalResult.rows[0]?.allow_modify_profile_picture;
        const adminAllow = adminResult.rows[0]?.allow_modify_profile_picture;

        const isAllowed = globalAllow && adminAllow;

        let allowedRoles;

        if (isAllowed) {
          const roles = await fetchRoles();
          allowedRoles = roles;
        } else {
          allowedRoles = ['SuperAdmin'];
        }

        return verifyRoles(...allowedRoles)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    upload.single('profilePicture'),
    usersController.uploadProfilePicture
  );


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
          'Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_registered'
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
        verifyRoles('Admin', 'SuperAdmin', 'Moderator', 'User_subscribed', 'User_registered')(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    (req, res) => {
      usersController.getSubscriptionStatus(req, res);
    }
  );

// Update user profile
router.route('/update')
  .put(
    async (req, res, next) => {
      try {
        const { editMode } = req.body;

        const settingKeyMap = {
          username: 'allow_edit_username',
          email: 'allow_edit_email',
          password: 'allow_edit_password',
          profilePicture: 'allow_modify_profile_picture',
        };

        const settingKey = settingKeyMap[editMode];

        if (!settingKey) {
          return res.status(400).json({ message: 'Invalid edit mode.' });
        }

        // Fetch from both global and admin settings
        const [globalResult, adminResult] = await Promise.all([
          pool.query(`
            SELECT 
              allow_edit_username, 
              allow_edit_email, 
              allow_edit_password,
              allow_modify_profile_picture
            FROM global_provider_settings
            LIMIT 1;
          `),
          pool.query(`
            SELECT 
              allow_edit_username, 
              allow_edit_email, 
              allow_edit_password,
              allow_modify_profile_picture
            FROM admin_settings
            LIMIT 1;
          `)
        ]);

        const globalSettings = globalResult.rows[0] || {};
        const adminSettings = adminResult.rows[0] || {};

        // Allow only if both global and admin say true
        const isAllowed = globalSettings[settingKey] && adminSettings[settingKey];

        let allowedRoles = [];

        if (isAllowed) {
          const roles = await fetchRoles();
          allowedRoles = roles;
        } else {
          allowedRoles = ['SuperAdmin'];
        }

        return verifyRoles(...allowedRoles)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.updateUser
  );

// Update user language preference
router.route('/update-language')
  .put(
    async (req, res, next) => {
      try {
        const { language, userId } = req.body;  // Destructure language and userId from request body

        if (!language) {
          return res.status(400).json({ message: 'Language is required.' });
        }

        // Validate language (example, only accepting certain languages)
        const validLanguages = ['en', 'es', 'fr']; // Add all allowed languages here
        if (!validLanguages.includes(language)) {
          return res.status(400).json({ message: 'Invalid language selected.' });
        }

        // Fetch roles and verify permissions (you can adjust these roles according to your need)
        const rolesList = await fetchRoles();

        // Verify if the roles are allowed to proceed
        const verifyResult = await new Promise((resolve, reject) => {
          verifyRoles(...rolesList)(req, res, (err) => {
            if (err) reject(err);  // If there's an error, reject the promise
            resolve();  // If no error, resolve the promise
          });
        });

        // Now, update the user's language in the database
        const result = await pool.query(`
          UPDATE users 
          SET language = $1 
          WHERE user_id = $2
          RETURNING *;
        `, [language, userId]);

        if (result.rowCount > 0) {
          return res.status(200).json({
            message: 'Language updated successfully.',
            user: result.rows[0] // Optionally return updated user data
          });
        } else {
          return res.status(404).json({ message: 'User not found.' });
        }

      } catch (err) {
        next(err);  // Pass the error to the next middleware (error handler)
      }
    }
  );



//Soft delete user account 
router.route('/softdelete/:userId')
  .put(
    async (req, res, next) => {
      try {
        const [globalResult, adminResult] = await Promise.all([
          pool.query(`SELECT allow_delete_my_user FROM global_provider_settings LIMIT 1;`),
          pool.query(`SELECT allow_delete_my_user FROM admin_settings LIMIT 1;`)
        ]);

        const globalAllow = globalResult.rows[0]?.allow_delete_my_user;
        const adminAllow = adminResult.rows[0]?.allow_delete_my_user;

        const isAllowed = globalAllow && adminAllow;

        let allowedRoles;

        if (isAllowed) {
          allowedRoles = await fetchRoles();
        } else {
          allowedRoles = ['SuperAdmin'];
        }

        return verifyRoles(...allowedRoles)(req, res, next);
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
        const settingsResult = await pool.query(`
          SELECT allow_delete_users FROM global_provider_settings LIMIT 1;
        `);
        const { allow_delete_users } = settingsResult.rows[0];

        const allowedRoles = allow_delete_users
          ? ['Admin', 'SuperAdmin']
          : ['SuperAdmin'];

        verifyRoles(...allowedRoles)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    usersController.adminVersionSoftDeleteUser
  );

// Update roles (by admin or superadmin only if feature is enabled)
router.route('/:user_id/roles')
  .put(
    async (req, res, next) => {
      try {
        const settingsResult = await pool.query(`
          SELECT allow_manage_roles FROM global_provider_settings LIMIT 1;
        `);
        const { allow_manage_roles } = settingsResult.rows[0];

        const allowedRoles = allow_manage_roles
          ? ['Admin', 'SuperAdmin']
          : ['SuperAdmin'];

        verifyRoles(...allowedRoles)(req, res, next);
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

router.route('/:userId/social-visibility')

  .put(
    async (req, res, next) => {
      try {

        // Fetch roles and verify permissions
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next);

      } catch (err) {
        next(err);
      }
    },
    async (req, res) => {
      const { userId } = req.params;
      const { socialVisibility } = req.body;


      try {

        const result = await pool.query(`
          UPDATE users 
          SET social_visibility = $1
          WHERE user_id = $2
          RETURNING user_id, social_visibility;
        `, [socialVisibility, userId]);

        if (result.rowCount > 0) {
          return res.status(200).json({
            message: 'Social visibility updated successfully.',
            user: result.rows[0]
          });
        } else {
          return res.status(404).json({ message: 'User not found.' });
        }
      } catch (err) {
        next(err);
      }
    }
  );



module.exports = router;
