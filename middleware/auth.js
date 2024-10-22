//middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes with JWT authentication
const protect = async (req, res, next) => {
    let token;

    console.log('Headers:', req.headers); // Debug log for headers

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('Extracted token:', token); // Debug log for token

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Debug log for decoded token

            // Get user from token and exclude password from returned user data
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('No user found for decoded token'); // Debug log if user not found
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next(); // Proceed to next middleware
        } catch (error) {
            console.error('Token verification error:', error);

            // Check if the error is due to token expiry
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired, please login again'
                });
            }

            res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    } else {
        console.log('No token provided in Authorization header'); // Debug log for missing token
        res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

module.exports = { protect };


