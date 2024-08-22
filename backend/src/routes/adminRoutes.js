// routes/admin.js
const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const adminController = require('../controllers/adminController')

router.get('/dashboard', authAdmin, adminController.checkAdmin);
// Route Product
router.get('/getAllProduct', authAdmin, adminController.getAllProducts);
router.post('/add-product', authAdmin, adminController.addProduct);
router.put('/update-product/:id', authAdmin, adminController.updateProduct);
router.get('/products/:id', authAdmin, adminController.getProductId);
router.delete('/products/:id', authAdmin, adminController.deleteProduct);
router.get('/totalProducts', authAdmin, adminController.getTotalProducts);
// Route Order
router.get('/getAllOrder', authAdmin, adminController.getAllOrder);
router.put('/updateOrderStatus/:orderId', authAdmin, adminController.updateOrderStatus);
router.delete('/deleteOrder/:orderId', authAdmin, adminController.deleteOrder);
router.get('/totalOrders', authAdmin, adminController.getTotalOrders);
router.get('/totalPendingOrders', authAdmin, adminController.getTotalPendingOrders);
// Route User
router.get('/getAllUsers', authAdmin, adminController.getAllUsers);
router.put('/updateUserRole', authAdmin, adminController.updateUserRole);
router.get('/totalUsers', authAdmin, adminController.getTotalUsers);
router.delete('/deleteUser/:id', authAdmin, adminController.deleteUser);


module.exports = router;
