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
router.get('/totalResolveOrders', authAdmin, adminController.getTotalResolveOrders);
router.get('/totalShippingOrders', authAdmin, adminController.getTotalShippingOrders);
router.get('/totalCompletedOrders', authAdmin, adminController.getTotalCompletedOrders);
router.get('/totalCancelOrders', authAdmin, adminController.getTotalCancelOrders);

router.get('/getSoldOrders', authAdmin, adminController.getSoldOrders);
router.get('/getShipOrders', authAdmin, adminController.getShipOrders);
router.get('/getResolvedOrders', authAdmin, adminController.getResolvedOrders);
router.get('/getCancelledOrders', authAdmin, adminController.getCancelledOrders);

router.put('/updateOrderStatus/:orderId', authAdmin, adminController.updateOrderStatus);
router.post('/deleteOrder', authAdmin, adminController.deleteOrder);

// Route User
router.get('/getAllUsers', authAdmin, adminController.getAllUsers);
router.get('/totalUsers', authAdmin, adminController.getTotalUsers);
router.delete('/deleteUser/:id', authAdmin, adminController.deleteUser);
router.put('/updateUserRole', authAdmin, adminController.updateUserRole);

//Route Blog
router.get('/getAllBlogAdmin', authAdmin, adminController.getAllBlogAdmin);
router.post('/deleteBlogAdmin', authAdmin, adminController.deleteBlogAdmin);
router.put('/updateStatusBlogAdmin', authAdmin, adminController.UpdateStatusBlogAdmin);


//Category
const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../frontend/src/asset/Images'); // Đường dẫn lưu file
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Đặt tên file với timestamp và thay thế khoảng trắng
        const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix);
    },
});

const upload1 = multer({ storage: storage1 });
router.post('/addCategoryAdmin', authAdmin, upload1.single('categoryIcon'), adminController.addCategory)
router.get('/getAllCategoryAdmin', authAdmin, adminController.getAllCategory);
router.delete('/deleteCategoryAdmin/:categoryId', authAdmin, adminController.deleteCategory);
router.put('/updateCategoryAdmin/:id', authAdmin, upload1.single('categoryIcon'), adminController.updateCategory); // Cập nhật danh mục

module.exports = router;
