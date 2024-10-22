
// // controllers/adminController.js
// const Admin = require('../models/admin');
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // Generate JWT Token
// const generateToken = (id) => {
//     return jwt.sign(
//         { id },
//         process.env.JWT_SECRET || 'your-secret-key',
//         { expiresIn: '1d' }
//     );
// };

// // Admin Login
// exports.adminLogin = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please provide username and password'
//             });
//         }

//         // Find admin
//         const admin = await Admin.findOne({ username }).select('+password');
//         if (!admin) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials'
//             });
//         }

//         // Check password
//         const isMatch = await admin.matchPassword(password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials'
//             });
//         }

//         // Generate token
//         const token = generateToken(admin._id);

//         res.status(200).json({
//             success: true,
//             token,
//             admin: {
//                 id: admin._id,
//                 username: admin.username,
//                 email: admin.email,
//                 role: admin.role
//             }
//         });

//     } catch (error) {
//         console.error('Admin Login Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error in admin login'
//         });
//     }
// };

// // Get All Users
// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).json({
//             success: true,
//             users
//         });
//     } catch (error) {
//         console.error('Get Users Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching users'
//         });
//     }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             req.params.id,
//             { $set: req.body },
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         console.error('Update User Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating user'
//         });
//     }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'User deleted successfully'
//         });
//     } catch (error) {
//         console.error('Delete User Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting user'
//         });
//     }
// };



// controllers/adminController.js
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

exports.getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find()
            .populate('user', 'mobileNumber')
            .sort({ requestDate: -1 });

        res.status(200).json({
            success: true,
            data: withdrawals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching withdrawals',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateWithdrawalStatus = async (req, res) => {
    try {
        const { withdrawalId } = req.params;
        const { status } = req.body;

        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal request not found'
            });
        }

        withdrawal.status = status;
        if (status === 'approved' || status === 'rejected') {
            withdrawal.processedDate = new Date();
        }

        // If rejected, return the amount to user's wallet
        if (status === 'rejected') {
            const user = await User.findById(withdrawal.user);
            user.wallet.points += withdrawal.amount;
            user.wallet.balance += withdrawal.amount;
            await user.save();
        }

        await withdrawal.save();

        res.status(200).json({
            success: true,
            data: withdrawal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating withdrawal status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};