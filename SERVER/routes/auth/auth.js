const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { signinAttemptsLimit } = require('../../middleware/signinAttemptsLimit')

router.post('/', signinAttemptsLimit, authController.handleLogin);
router.post('/resend-verification-email', signinAttemptsLimit, authController.resendVerificationEmail);

router.post('/firebase-login', authController.handleFirebaseLogin); 


module.exports = router;