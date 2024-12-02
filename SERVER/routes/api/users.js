const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles'
);

router.route('/')
  .get(
    verifyRoles(ROLES_LIST.find(role => role === 'ADMIN')),
    usersController.getAllUsers)

router.route('/:user_id')
  .get(
    verifyRoles(...ROLES_LIST),  //All roles have access to this route
    (req, res) => {
      const { user_id } = req.params;
      usersController.getUserById(req, res);
    });

// Update user information (any logged-in user can update their own info)
router.route('/update')
  .put(
    verifyRoles(...ROLES_LIST),
    usersController.updateUser
  );
module.exports = router;