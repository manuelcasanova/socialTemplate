const express = require('express');
const router = express.Router();
const logEventsController = require('../../controllers/logEventsController');
const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

//Log role modification
router.route('/role-modification/logs')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(...rolesList)(req, res, next); // Make sure the user is authorized (admin check)
      } catch (err) {
        next(err);
      }
    },
    logEventsController.getRoleChangeLogs
  );



module.exports = router;
