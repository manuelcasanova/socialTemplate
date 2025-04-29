const express = require('express');
const router = express.Router();
const logEventsController = require('../../controllers/logEventsController');
const verifyRoles = require('../../middleware/verifyRoles');

//Log role modification
router.route('/role-modification/logs')
  .get(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin')(req, res, next); 
      } catch (err) {
        next(err);
      }
    },
    logEventsController.getRoleChangeLogs
  );

module.exports = router;
