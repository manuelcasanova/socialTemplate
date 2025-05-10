const express = require('express');
const router = express.Router();
const { createCustomRole, updateCustomRole, deleteCustomRole } = require('../../controllers/customRolesPrivateController');
const verifyRoles = require('../../middleware/verifyRoles');

const allowedRoles = ['Admin', 'SuperAdmin'];

router.post('/', verifyRoles(...allowedRoles), createCustomRole);

router.put('/:id', verifyRoles(...allowedRoles), updateCustomRole);

router.delete('/:id', verifyRoles(...allowedRoles), deleteCustomRole);

module.exports = router;
