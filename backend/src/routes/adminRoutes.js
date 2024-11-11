// routes/admin.js
const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const adminController = require('../controllers/adminController')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../frontend/src/asset/images-product'); // Đường dẫn lưu file
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Đặt tên file với timestamp và thay thế khoảng trắng
        const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

router.get('/dashboard', authAdmin, adminController.checkAdmin);
// Route Product
router.get('/getAllProduct', authAdmin, adminController.getAllProducts);
router.get('/products/:id', authAdmin, adminController.getProductId);
router.get('/totalProducts', authAdmin, adminController.getTotalProducts);
router.post('/add-product', authAdmin, upload.single('image'), adminController.addProduct);
router.put('/update-product/:id', authAdmin, upload.single('image'), adminController.updateProduct);
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
