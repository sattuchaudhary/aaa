// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please provide a product name'],
//     trim: true,
//     maxlength: [50, 'Name cannot be more than 50 characters']
//   },
//   carat: {
//     type: Number,
//     required: [true, 'Please specify the carat size'],
//     min: [1, 'Carat size must be at least 1']
//   },
//   price: {
//     type: Number,
//     required: [true, 'Please specify the price'],
//     min: [0, 'Price cannot be negative']
//   },
//   dailyIncome: {
//     type: Number,
//     required: [true, 'Please specify the daily income'],
//     min: [0, 'Daily income cannot be negative']
//   },
//   validityPeriod: {
//     type: Number,
//     required: [true, 'Please specify the validity period in days'],
//     min: [1, 'Validity period must be at least 1 day']
//   },
//   totalIncome: {
//     type: Number,
//     required: [true, 'Please specify the total income'],
//     min: [0, 'Total income cannot be negative']
//   },
//   image: {
//     type: String,
//     required: [true, 'Please provide an image URL for the product']
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Virtual for calculating total income
// productSchema.virtual('calculatedTotalIncome').get(function() {
//   return this.dailyIncome * this.validityPeriod;
// });

// // Pre-save middleware to ensure totalIncome matches calculatedTotalIncome
// productSchema.pre('save', function(next) {
//   if (this.isModified('dailyIncome') || this.isModified('validityPeriod')) {
//     this.totalIncome = this.dailyIncome * this.validityPeriod;
//   }
//   next();
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;



// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  dailyIncome: Number,
  validity: Number,
  totalRevenue: Number
});

module.exports = mongoose.model('Product', productSchema);
