const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../../controllers/forgotPasswordController');

router.post('/', forgotPasswordController.handlePost);

router.get('/:id/:token', forgotPasswordController.handleGet);

router.post('/:id/:token', forgotPasswordController.handlePostVerified);

module.exports = router;