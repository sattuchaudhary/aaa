// models/PurchasedProduct.js
const mongoose = require('mongoose');

const purchasedProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },
    dailyIncome: {
        type: Number,
        required: true
    },
    totalRevenue: {
        type: Number,
        required: true
    },
    lastClaimTime: {
        type: Date
    },
    remainingDays: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchasedProduct', purchasedProductSchema);