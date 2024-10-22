// // src/models/BankAccount.js
// const mongoose = require('mongoose');

// const bankAccountSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   accountHolderName: { type: String, required: true },
//   accountNumber: { type: String, required: true, unique: true },
//   bankName: { type: String, required: true },
//   ifscCode: { type: String, required: true },
//   branchName: { type: String, required: true },
//   accountType: { type: String, enum: ['savings', 'current'], required: true },
//   mobileNumber: { type: String, required: true },
//   balance: { type: Number, default: 0 }
// });

// module.exports = mongoose.model('BankAccount', bankAccountSchema);