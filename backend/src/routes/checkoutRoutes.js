const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/orderController');
const authUser = require('../middleware/authUser');

// Route xử lý thanh toán
router.get('/userOrder', authUser, checkoutController.userOrder)
router.post('/checkout', authUser, checkoutController.checkout);
router.put('/finish/:orderId', authUser, checkoutController.updateOrderStatus);
router.post('/cancel', authUser, checkoutController.cancelOrder);

module.exports = router;
