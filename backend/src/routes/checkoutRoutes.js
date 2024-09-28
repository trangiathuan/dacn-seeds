const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/orderController');
const authUser = require('../middleware/authUser');

// Route xử lý thanh toán
router.post('/checkout', authUser, checkoutController.checkout);

module.exports = router;
