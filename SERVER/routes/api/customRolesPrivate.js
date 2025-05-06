const express = require('express');
const router = express.Router();
const {
  createCustomRole,
  updateCustomRole,
  deleteCustomRole
} = require('../../controllers/customRolesPrivateController');

// Create a new custom role
router.post('/', createCustomRole);

// Update a custom role
router.put('/:id', updateCustomRole);

// Delete a custom role
router.delete('/:id', deleteCustomRole);


module.exports = router;
