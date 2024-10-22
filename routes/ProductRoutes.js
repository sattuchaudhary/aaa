




// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { purchaseProduct } = require('../controllers/productController');



router.post('/buy-product', protect, purchaseProduct);

module.exports = router;
