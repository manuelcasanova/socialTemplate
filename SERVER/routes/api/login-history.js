const express = require('express');
const router = express.Router();
const loginHistoryController = require('../../controllers/loginHistoryController')

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
    loginHistoryController.getLoginHistory
  );



module.exports = router;
