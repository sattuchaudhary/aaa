
// routes/withdrawRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createWithdrawal,
    getMyWithdrawals
} = require('../controllers/withdrawController');

router.post('/withdraw', protect, createWithdrawal);
router.get('/my-withdrawals', protect, getMyWithdrawals);

module.exports = router;