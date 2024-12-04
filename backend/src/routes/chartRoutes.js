const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const chartController = require('../controllers/chartController');

// Lấy doanh thu theo ngày
router.get('/daily-revenue', authAdmin, chartController.getRevenueByDate);

// Lấy doanh thu theo tháng
router.get('/monthly-revenue', authAdmin, chartController.getRevenueByMonth);

// Lấy doanh thu theo năm
router.get('/yearly-revenue', authAdmin, chartController.getRevenueByYear);

router.get('/export-revenue-excel', authAdmin, chartController.exportRevenueToExcel);

// Lấy thống kê số lượng sản phảm theo danh mục
router.get('/quantity-by-category/:categoryId', authAdmin, chartController.getProductQuantityByCategory);

router.get('/sales-by-category/:categoryId', authAdmin, chartController.getProductSalesByCategory);


module.exports = router;
