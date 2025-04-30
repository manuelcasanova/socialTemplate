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


module.exports = router;
