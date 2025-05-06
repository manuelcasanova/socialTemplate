const express = require('express');
const router = express.Router();
const { getAllCustomRoles } = require('../../controllers/customRolesController');

router.get('/', getAllCustomRoles);

module.exports = router;
