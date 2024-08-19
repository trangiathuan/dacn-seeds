const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/orderController');
const authUser = require('../middleware/authOrder');

// Route xử lý thanh toán
router.post('/checkout', authUser, checkoutController.checkout);

module.exports = router;
