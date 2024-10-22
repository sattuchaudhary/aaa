// controllers/myProductController.js
const PurchasedProduct = require('../models/PurchasedProduct');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// Keep existing getMyProducts function and add new claim function
exports.getMyProducts = asyncHandler(async (req, res) => {
    const products = await PurchasedProduct.find({ userId: req.user.id })
        .populate('productId')
        .sort('-purchaseDate');

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// Add new claim function
exports.claimDailyIncome = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    // Get the purchased product
    const purchasedProduct = await PurchasedProduct.findOne({
        _id: productId,
        userId: userId
    });

    if (!purchasedProduct) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Check if product is expired
    if (new Date() > purchasedProduct.expiryDate) {
        return res.status(400).json({
            success: false,
            message: 'Product has expired'
        });
    }

    // Get current date in Indian time
    const indianTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const currentDate = new Date(indianTime);
    
    // If lastClaimTime exists, check if it's from the same day
    if (purchasedProduct.lastClaimTime) {
        const lastClaimDate = new Date(purchasedProduct.lastClaimTime);
        
        if (lastClaimDate.toDateString() === currentDate.toDateString()) {
            return res.status(400).json({
                success: false,
                message: 'Daily income already claimed today'
            });
        }
    }

    // Get user
    const user = await User.findById(userId);

    // Update user's balances
    const dailyIncome = purchasedProduct.dailyIncome;
    user.wallet.balance += dailyIncome;
    user.statistics.todayIncome += dailyIncome;
    user.statistics.totalIncome += dailyIncome;
    user.wallet.points += dailyIncome;

    // Update purchased product
    purchasedProduct.lastClaimTime = currentDate;
    purchasedProduct.remainingDays -= 1;

    // Save changes
    await Promise.all([
        user.save(),
        purchasedProduct.save()
    ]);

    res.status(200).json({
        success: true,
        message: 'Daily income claimed successfully',
        data: {
            claimedAmount: dailyIncome,
            newBalance: user.wallet.balance,
            todayIncome: user.statistics.todayIncome,
            totalIncome: user.statistics.totalIncome
        }
    });
});