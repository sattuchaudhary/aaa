// // middleware/adminAuth.js
// const jwt = require('jsonwebtoken');
// const Admin = require('../models/admin');

// exports.protectAdmin = async (req, res, next) => {
//     try {
//         let token;

//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1];
//         }

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Not authorized to access this route'
//             });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
//         // Get admin from token
//         const admin = await Admin.findById(decoded.id);
//         if (!admin) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Not authorized to access this route'
//             });
//         }

//         req.admin = admin;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Not authorized to access this route'
//         });
//     }
// };



// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminProtect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user || !user.isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized as admin'
                });
            }

            req.user = user;
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};

module.exports = { adminProtect };