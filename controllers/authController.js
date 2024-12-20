const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const admin = require('../config/firebase');



// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
    );
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

//Send OTP Controller
exports.sendOTP = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid Indian mobile number'
            });
        }

        await OTP.deleteMany({ mobileNumber });

        const otp = generateOTP();
        await OTP.create({
            mobileNumber,
            otp,
            createdAt: new Date()
        });

        if (process.env.NODE_ENV === 'development') {
            console.log(`OTP for ${mobileNumber}: ${otp}`);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};



// ---------------------------------------------------------------------------------------------------------------------------------------



// Register Controller
exports.register = async (req, res) => {
    try {
        const { mobileNumber, password, confirmPassword, otp, referralCode } = req.body;

        // Validation
        if (!mobileNumber || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({
            mobileNumber,
            otp
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

                // Handle referral code
                let referredBy = null;
                if (referralCode) {
                    const referrer = await User.findOne({ referralCode });
        
                    if (referrer) {
                        referredBy = referrer._id;
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid referral code'
                        });
                    }
                }

        // Create user
        const user = await User.create({
            mobileNumber,
            password,
            referredBy //undefined // Handle referral logic here if needed
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                mobileNumber: user.mobileNumber,
                referralCode: user.referralCode,
                wallet: user.wallet
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide mobile number and password'
            });
        }

        const user = await User.findOne({ mobileNumber }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                mobileNumber: user.mobileNumber,
                referralCode: user.referralCode,
                wallet: user.wallet
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Profile Controller
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

// Update Profile Controller
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

// Change Password Controller
exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        
        // Verify current password
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password'
        });
    }
};

// Check Auth Controller
exports.checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Check Auth Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking authentication'
        });
    }
};



//------------------------wallet--------







// Get user account information
exports.getAccountInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -withdrawalPassword');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getAccountInfo:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching account information'
        });
    }
};

// Update account statistics
exports.updateAccountStats = async (req, res) => {
    try {
        const { statistics, wallet } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    statistics,
                    wallet
                }
            },
            { new: true }
        ).select('-password -withdrawalPassword');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in updateAccountStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating account statistics'
        });
    }
};



// Backend - Add to authController.js
// Add these new controller functions:

// Add these new controller functions
exports.sendForgotPasswordOTP = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid Indian mobile number'
            });
        }

        // Check if user exists
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await OTP.deleteMany({ mobileNumber });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({
            mobileNumber,
            otp,
            createdAt: new Date()
        });

        if (process.env.NODE_ENV === 'development') {
            console.log(`OTP for ${mobileNumber}: ${otp}`);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('Send Forgot Password OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP'
        });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { mobileNumber, newPassword, otp } = req.body;

        // Verify OTP
        const otpRecord = await OTP.findOne({
            mobileNumber,
            otp
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Find user and update password
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = newPassword;
        await user.save();

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};
