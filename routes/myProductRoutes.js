// routes/myProductRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyProducts, claimDailyIncome } = require('../controllers/myProductController');

router.get('/my-products', protect, getMyProducts);
router.post('/claim-daily-income', protect, claimDailyIncome);

module.exports = router;