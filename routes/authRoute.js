const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { authorization, validateRegister } = require('../middleware/authMiddleware');


router.post('/auth/register', validateRegister, register);
router.post('/auth/login', login);
router.post('/auth/verify-email', verifyEmail)
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/verify-otp', verifyOTP)
router.patch('/auth/reset-password', authorization, resetPassword);


module.exports = router;