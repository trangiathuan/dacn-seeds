// routes/admin.js
const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const adminController = require('../controllers/adminController')

router.get('/dashboard', authAdmin, adminController.checkAdmin);
// Route Product
router.get('/getAllProduct', authAdmin, adminController.getAllProducts);
router.get('/products/:id', authAdmin, adminController.getProductId);
router.get('/totalProducts', authAdmin, adminController.getTotalProducts);
router.post('/add-product', authAdmin, adminController.addProduct);
router.put('/update-product/:id', authAdmin, adminController.updateProduct);
router.delete('/products/:id', authAdmin, adminController.deleteProduct);
// Route Order
router.get('/getAllOrder', authAdmin, adminController.getAllOrder);
router.get('/totalOrders', authAdmin, adminController.getTotalOrders);
router.get('/totalPendingOrders', authAdmin, adminController.getTotalPendingOrders);
router.get('/getSoldOrders', authAdmin, adminController.getSoldOrders);
router.put('/updateOrderStatus/:orderId', authAdmin, adminController.updateOrderStatus);
router.post('/deleteOrder', authAdmin, adminController.deleteOrder);
// Route User
router.get('/getAllUsers', authAdmin, adminController.getAllUsers);
router.get('/totalUsers', authAdmin, adminController.getTotalUsers);
router.delete('/deleteUser/:id', authAdmin, adminController.deleteUser);
router.put('/updateUserRole', authAdmin, adminController.updateUserRole);

module.exports = router;
