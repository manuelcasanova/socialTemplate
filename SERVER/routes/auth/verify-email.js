const express = require('express');
const router = express.Router();
const { handleVerifyEmail } = require('../../controllers/handleVerifyEmail');  

router.get('/:user_id/:token', handleVerifyEmail);

module.exports = router;
