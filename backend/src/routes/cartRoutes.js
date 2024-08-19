const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authCart = require('../middleware/authCart'); // Middleware bảo vệ route

router.get('/cart', authCart, cartController.getCartItems);
router.post('/cart', authCart, cartController.addToCart);
router.put('/cart/:id', authCart, cartController.updateCartItem);
router.delete('/cart/:id', authCart, cartController.deleteCartItem);

module.exports = router;
