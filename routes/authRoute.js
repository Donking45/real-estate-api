const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { authorization, validateRegister } = require('../middleware/authMiddleware');


router.post('/auth/register', validateRegister, register);
router.post('/auth/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password', authorization, resetPassword);


module.exports = router;