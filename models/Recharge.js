// const mongoose = require('mongoose');

// const rechargeSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     amount: {
//         type: Number,
//         required: true,
//         min: [1, 'Amount must be positive']
//     },
//     utrNumber: {
//         type: String,
//         required: true
//     },
//     paymentMethod: {
//         type: String,
//         enum: ['UPI', 'SCANNER'],
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['PENDING', 'APPROVED', 'REJECTED'],
//         default: 'PENDING'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Recharge', rechargeSchema);



const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, 'Amount must be positive']
    },
    utrNumber: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'SCANNER'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recharge', rechargeSchema);