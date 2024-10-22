
// controllers/productController.js
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const PurchasedProduct = require('../models/PurchasedProduct');

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

exports.getMyProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('purchasedProducts');
  res.status(200).json({
    success: true,
    data: user.purchasedProducts
  });
});



exports.purchaseProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has enough balance
    if (user.wallet.balance < product.price) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Calculate expiry date
    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate.getTime() + (product.validity * 24 * 60 * 60 * 1000));

    // Create purchased product record
    const purchasedProduct = await PurchasedProduct.create({
      userId: userId,
      productId: productId,
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      dailyIncome: product.dailyIncome,
      totalRevenue: product.totalRevenue,
      remainingDays: product.validity
    });

    // Update user's wallet and purchased products
    user.wallet.balance -= product.price;
    user.purchasedProducts.push(purchasedProduct._id);
    user.statistics.totalAssets += product.price;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product purchased successfully',
      data: {
        purchasedProduct,
        remainingBalance: user.wallet.balance
      }
    });

  } catch (error) {
    console.error('Purchase Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

