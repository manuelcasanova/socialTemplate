const express = require('express');
const router = express.Router();
const { createCustomRole, updateCustomRole, deleteCustomRole, updateRoleVisibility } = require('../../controllers/customRolesPrivateController');
const verifyRoles = require('../../middleware/verifyRoles');

const pool = require('../../config/db')

// Function to check the settings and dynamically modify the allowed roles
const getConditionalAllowedRoles = async (action) => {
  // Query the database for global provider settings
  const result = await pool.query(`
    SELECT allow_admin_create_custom_role, allow_admin_edit_custom_role, allow_admin_delete_custom_role
    FROM global_provider_settings;
  `);

  const settings = result.rows[0]; 

  let allowedRoles = ['SuperAdmin']; // SuperAdmin always has access

  if (action === 'create' && settings.allow_admin_create_custom_role) {
    allowedRoles.push('Admin');
  } else if (action === 'edit' && settings.allow_admin_edit_custom_role) {
    allowedRoles.push('Admin');
  } else if (action === 'delete' && settings.allow_admin_delete_custom_role) {
    allowedRoles.push('Admin');
  }

  return allowedRoles; 
};

// Route to create a new custom role
router.post('/', async (req, res, next) => {
  try {
    const allowedRoles = await getConditionalAllowedRoles('create');
    verifyRoles(...allowedRoles)(req, res, next);
  } catch (err) {
    next(err); 
  }
}, createCustomRole);

// Route to update a custom role
router.put('/:id', async (req, res, next) => {
  try {
    const allowedRoles = await getConditionalAllowedRoles('edit');
    verifyRoles(...allowedRoles)(req, res, next);
  } catch (err) {
    next(err); 
  }
}, updateCustomRole);

// Route to update a custom role's visibility
router.put('/:id/visibility', async (req, res, next) => {
  try {
    const allowedRoles = await getConditionalAllowedRoles('edit');
    verifyRoles(...allowedRoles)(req, res, next);
  } catch (err) {
    next(err); 
  }
}, updateRoleVisibility);

// Route to delete a custom role
router.delete('/:id', async (req, res, next) => {
  try {
    const allowedRoles = await getConditionalAllowedRoles('delete');
    verifyRoles(...allowedRoles)(req, res, next);
  } catch (err) {
    next(err); 
  }
}, deleteCustomRole);

module.exports = router;
