const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');


router.post('/', registerController.handleNewUser);

const admin = require('../../firebaseAdmin'); 

router.post('/google', registerController.handleGoogleSignUp);

module.exports = router;