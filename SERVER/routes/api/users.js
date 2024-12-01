const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles'
);

router.route('/')
  .get(
    verifyRoles(ROLES_LIST.ADMIN), 
    usersController.getAllUsers)

    router.route('/:user_id')
    .get(
      verifyRoles(...Object.values(ROLES_LIST)),  //All roles have access to this route
      (req, res) => {
      const { user_id } = req.params;
      usersController.getUserById(req, res);
    });

module.exports = router;