const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const fetchRoles = require('../../config/fetchRoles'); 
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
  .get(
    async (req, res, next) => {
      try {
        const rolesList = await fetchRoles();
        verifyRoles(rolesList.find(role => role === 'ADMIN'))(req, res, next); 
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

module.exports = router;
