const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { authMiddleware }= require('../middleware/authMiddleware');


router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password', authMiddleware, resetPassword);


module.exports = router;
