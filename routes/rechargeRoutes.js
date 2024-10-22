// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const { createRechargeRequest } = require('../controllers/rechargeController');

// // Create recharge request route
// router.post('/recharge-request', protect, createRechargeRequest);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createRechargeRequest, 
    getAllRechargeRequests, 
    processRechargeRequest 
} = require('../controllers/rechargeController');

// User routes
router.post('/recharge-request', protect, createRechargeRequest);

// Admin routes (you'll need to add admin middleware)
router.get('/admin/recharge-requests', protect, getAllRechargeRequests);
router.put('/admin/recharge-request/:id', protect, processRechargeRequest);

module.exports = router;