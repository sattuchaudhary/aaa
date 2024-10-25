
//routes/auth.js

// routes/auth.js
const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    sendOTP, 
    getProfile, 
    updateProfile, 
    changePassword,
    checkAuth,
    getAccountInfo,
    resetPassword,
    sendForgotPasswordOTP,
    updateAccountStats,
    
    
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');






// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/check-auth', protect, checkAuth);
router.get('/account-info', protect, getAccountInfo);
router.put('/account-stats', protect, updateAccountStats);

//
router.post('/forgot-password/send-otp', sendForgotPasswordOTP);
router.post('/forgot-password/reset', resetPassword);
// In your routes/auth.js
// router.post('/verify-otp', verifyOTP);

module.exports = router;


