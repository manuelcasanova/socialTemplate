const express = require('express');
const router = express.Router();
const resetAccountController = require('../../controllers/resetAccountController');


router.post('/', resetAccountController.handleReset);

module.exports = router;