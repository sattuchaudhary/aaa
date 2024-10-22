// models/Withdrawal.js
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, 'Amount must be at least 1']
    },
    status: {
        type: String,
        enum: ['requested', 'pending', 'processing', 'approved', 'rejected'],
        default: 'requested'
    },
    bankDetails: {
        accountNumber: {
            type: String,
            required: true
        },
        accountHolderName: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        }
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    processedDate: {
        type: Date
    }
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);