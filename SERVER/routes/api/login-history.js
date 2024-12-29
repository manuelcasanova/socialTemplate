const express = require('express');
const router = express.Router();
const loginHistoryController = require('../../controllers/loginHistoryController')

const fetchRoles = require('../../config/fetchRoles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')

  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles('SuperAdmin')(req, res, next); 
      } catch (err) {
        next(err);
      }
    },
    loginHistoryController.getLoginHistory
  );



module.exports = router;
