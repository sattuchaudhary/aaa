//new 

// src/routes/Product.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust based on your user model path
const Product = require('../models/Product'); // Adjust based on your product model path

// Middleware to verify user (you can customize it as needed)
// const { verifyUser } = require('../middleware/Auth');

// POST /api/buy-product
router.post('/buy-product', verifyUser, async (req, res) => {
  const { productId, price } = req.body;
  const userId = req.user.id; // Assuming you have user ID in req.user

  try {
    const user = await User.findById(userId);
    
    if (user.balance < price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Deduct the price from user account
    user.balance -= price;
    
    // Add product to user's purchased products (Assuming you have a purchasedProducts field)
    user.purchasedProducts.push(productId);
    
    await user.save(); // Save updated user

    // Optionally, you could also update product ownership if necessary

    res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;