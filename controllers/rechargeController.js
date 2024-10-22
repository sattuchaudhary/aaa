// const Recharge = require('../models/Recharge');

// // Create recharge request
// exports.createRechargeRequest = async (req, res) => {
//     try {
//         const { amount, utrNumber, paymentMethod } = req.body;

//         // Create recharge request
//         const recharge = await Recharge.create({
//             user: req.user.id,
//             amount,
//             utrNumber,
//             paymentMethod
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Recharge request submitted successfully',
//             data: recharge
//         });
//     } catch (error) {
//         console.error('Create Recharge Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating recharge request'
//         });
//     }
// };


const Recharge = require('../models/Recharge');
const User = require('../models/User');

// Create recharge request
exports.createRechargeRequest = async (req, res) => {
    try {
        const { amount, utrNumber, paymentMethod } = req.body;

        const recharge = await Recharge.create({
            user: req.user.id,
            amount,
            utrNumber,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            data: recharge
        });
    } catch (error) {
        console.error('Create Recharge Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating recharge request'
        });
    }
};

// Get all recharge requests (admin only)
exports.getAllRechargeRequests = async (req, res) => {
    try {
        const requests = await Recharge.find()
            .populate('user', 'mobileNumber')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recharge requests'
        });
    }
};

// Process recharge request (admin only)
exports.processRechargeRequest = async (req, res) => {
    try {
        const { status } = req.body;
        const recharge = await Recharge.findById(req.params.id);

        if (!recharge) {
            return res.status(404).json({
                success: false,
                message: 'Recharge request not found'
            });
        }

        if (status === 'APPROVED') {
            const user = await User.findById(recharge.user);
            
            // Update user's wallet and statistics
            user.wallet.balance += recharge.amount;
            user.wallet.rechargeAmount = recharge.amount;
            user.statistics.totalRecharge += recharge.amount;
            
            await user.save();
        }

        recharge.status = status;
        await recharge.save();

        res.status(200).json({
            success: true,
            data: recharge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing recharge request'
        });
    }
};