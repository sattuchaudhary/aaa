// controllers/withdrawController.js
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

exports.createWithdrawal = async (req, res) => {
    try {
        const { amount, bankDetails } = req.body;
        const user = await User.findById(req.user.id);

        // Check if user has sufficient points
        if (user.wallet.points < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient points for withdrawal'
            });
        }

        // Create withdrawal request
        const withdrawal = await Withdrawal.create({
            user: req.user.id,
            amount,
            bankDetails
        });

        // Deduct amount from user's points and balance
        user.wallet.points -= amount;
        user.wallet.balance -= amount;
        await user.save();

        res.status(201).json({
            success: true,
            data: withdrawal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating withdrawal request',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getMyWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ user: req.user.id })
            .sort({ requestDate: -1 });

        res.status(200).json({
            success: true,
            data: withdrawals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching withdrawals'
        });
    }
};