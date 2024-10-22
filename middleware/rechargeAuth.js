
// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = authMiddleware;

// // middleware/validator.js
// const { body, validationResult } = require('express-validator');

// const rechargeValidationRules = () => {
//   return [
//     body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
//     body('paymentMethod').isIn(['qr', 'upi']).withMessage('Invalid payment method'),
//     body('utrNumber').notEmpty().withMessage('UTR number is required')
//   ];
// };

// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };

// module.exports = {
//   rechargeValidationRules,
//   validate
// };