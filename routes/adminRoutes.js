
// // routes/adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const {
//     adminLogin,
//     getAllUsers,
//     updateUser,
//     deleteUser
// } = require('../controllers/adminController');
// const { protectAdmin } = require('../middleware/adminAuth');

// router.post('/login', adminLogin);
// router.get('/users', protectAdmin, getAllUsers);
// router.put('/users/:id', protectAdmin, updateUser);
// router.delete('/users/:id', protectAdmin, deleteUser);

// module.exports = router;



// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuth');
const {
    getAllWithdrawals,
    updateWithdrawalStatus
} = require('../controllers/adminController');

router.get('/withdrawals', adminProtect, getAllWithdrawals);
router.put('/withdrawals/:withdrawalId', adminProtect, updateWithdrawalStatus);

module.exports = router;