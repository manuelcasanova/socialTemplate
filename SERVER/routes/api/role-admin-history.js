const express = require('express');
const router = express.Router();
const adminRolesHistoryController = require('../../controllers/adminRolesHistoryController')

const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')

  .get(
    async (req, res, next) => {
      try {
        verifyRoles('SuperAdmin', 'Admin')(req, res, next); 
      } catch (err) {
        next(err);
      }
    },
    adminRolesHistoryController.getAdminRolesHistory
  );



module.exports = router;
