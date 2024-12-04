const Order = require('../models/order'); // Import model Order
const XLSX = require('xlsx');

// Hàm lấy doanh thu theo ngày
exports.getRevenueByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Kiểm tra nếu không có startDate và endDate
        if (!startDate || !endDate) {
            return res.status(400).json({ msg: 'Chưa chọn ngày bắt đầu và kết thúc' });
        }

        const orders = await Order.aggregate([
            {
                $match: {
                    status: 4, // Chỉ lấy các đơn hàng có status = 4 (hoàn thành)
                    createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } // Thời gian
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d", // Định dạng ngày: Năm-Tháng-Ngày
                            date: "$createdAt"  // Sử dụng ngày tạo đơn hàng
                        }
                    },
                    totalRevenue: { $sum: "$totalPrice" } // Tổng doanh thu của mỗi ngày
                }
            },
            {
                $sort: { "_id": 1 } // Sắp xếp theo ngày tăng dần
            }
        ]);

        // Gắn nhãn là các ngày
        const labels = orders.map(order => order._id); // Format: "YYYY-MM-DD"
        const values = orders.map(order => order.totalRevenue); // Tổng doanh thu

        res.json({ labels, values });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Lỗi khi lấy dữ liệu doanh thu' });
    }
};



// Hàm lấy doanh thu theo tháng
exports.getRevenueByMonth = async (req, res) => {
    try {
        const { year } = req.query;  // Lấy năm từ query (nếu có)

        const orders = await Order.aggregate([
            {
                $match: {
                    status: 4, // Chỉ lấy các đơn hàng có status = 4 (hoàn thành)
                    ...(year && { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${parseInt(year) + 1}-01-01`) } })  // Nếu có year, lọc theo năm
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group theo tháng
                    totalRevenue: { $sum: "$totalPrice" } // Tổng doanh thu của mỗi tháng
                }
            },
            {
                $sort: { "_id": 1 } // Sắp xếp theo tháng tăng dần
            }
        ]);

        const labels = orders.map(order => `Tháng ${order._id}`);
        const values = orders.map(order => order.totalRevenue);

        res.json({ labels, values });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Lỗi khi lấy dữ liệu doanh thu' });
    }
};

// Hàm lấy doanh thu theo năm
exports.getRevenueByYear = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $match: {
                    status: 4  // Chỉ lấy các đơn hàng có status = 4 (hoàn thành)
                }
            },
            {
                $group: {
                    _id: { $year: "$createdAt" }, // Group theo năm
                    totalRevenue: { $sum: "$totalPrice" } // Tổng doanh thu của mỗi năm
                }
            },
            {
                $sort: { "_id": 1 } // Sắp xếp theo năm tăng dần
            }
        ]);

        const labels = orders.map(order => `Năm ${order._id}`);
        const values = orders.map(order => order.totalRevenue);

        res.json({ labels, values });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Lỗi khi lấy dữ liệu doanh thu' });
    }
};

// Hàm xuất doanh thu ra file Excel



exports.exportRevenueToExcel = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Kiểm tra xem startDate và endDate có hợp lệ không
        if (!startDate || !endDate) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp startDate và endDate' });
        }

        // Chuyển startDate và endDate thành đối tượng Date
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        // Kiểm tra xem ngày tháng có hợp lệ không
        if (isNaN(startDateObj) || isNaN(endDateObj)) {
            return res.status(400).json({ msg: 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ' });
        }

        // Truy vấn dữ liệu doanh thu từ MongoDB
        const orders = await Order.aggregate([
            {
                $match: {
                    status: 4,  // Chỉ lấy các đơn hàng có trạng thái là 4 (hoàn thành)
                    createdAt: {
                        $gte: startDateObj,  // Ngày bắt đầu
                        $lt: endDateObj      // Ngày kết thúc
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfYear: "$createdAt" }, // Nhóm theo ngày trong năm
                    totalRevenue: { $sum: "$totalPrice" } // Tính tổng doanh thu mỗi ngày
                }
            },
            { $sort: { "_id": 1 } }  // Sắp xếp theo ngày tăng dần
        ]);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ msg: 'Không có dữ liệu doanh thu trong khoảng thời gian này' });
        }

        // Chuyển đổi dữ liệu doanh thu thành định dạng phù hợp cho Excel
        const formattedData = orders.map(order => {
            // Định dạng ngày
            const formattedDate = new Date(startDateObj.getFullYear(), 0, order._id); // Tạo ngày từ ngày đầu năm và ngày trong năm
            const formattedDateString = formattedDate.toLocaleDateString("vi-VN"); // Định dạng ngày theo chuẩn "dd/mm/yyyy"

            return {
                "Ngày": formattedDateString,  // Hiển thị ngày theo định dạng "dd/mm/yyyy"
                "Doanh thu": order.totalRevenue // Doanh thu trong ngày
            };
        });

        // Tạo sheet từ dữ liệu đã chuẩn bị
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");

        // Đặt tên file và headers cho file Excel
        const fileName = `Doanh_Thu_${startDate}_${endDate}.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Gửi file Excel dưới dạng buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Kiểm tra xem file có được tạo thành công không
        if (!excelBuffer || excelBuffer.length === 0) {
            return res.status(500).json({ msg: 'Lỗi khi tạo file Excel' });
        }

        // Gửi file Excel
        res.send(excelBuffer);

    } catch (error) {
        console.error(error); // Ghi lại lỗi chi tiết
        res.status(500).json({ msg: 'Lỗi khi xuất dữ liệu doanh thu ra file Excel', error: error.message });
    }
};

//
const mongoose = require('mongoose'); // Đảm bảo mongoose đã được import
const Category = require('../models/category'); // Import model Category
const Product = require('../models/product'); // Import model Product

exports.getProductQuantityByCategory = async (req, res) => {
    const { categoryId } = req.params; // Lấy categoryId từ params

    try {
        // Kiểm tra xem Category có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }

        // Lấy tất cả sản phẩm theo categoryId
        const products = await Product.find({ categoryID: new mongoose.Types.ObjectId(categoryId) });

        // Kiểm tra nếu không có sản phẩm trong danh mục
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm trong danh mục này.' });
        }

        // Trả về một mảng với label là tên sản phẩm và value là số lượng
        const result = products.map(product => ({
            label: product.productName,  // Tên sản phẩm
            value: product.quantity      // Số lượng sản phẩm
        }));

        // Trả về dữ liệu thống kê
        res.status(200).json({
            categoryName: category.categoryName,  // Tên danh mục
            products: result,  // Danh sách sản phẩm với tên và số lượng
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi khi lấy dữ liệu thống kê.' });
    }
};


exports.getProductSalesByCategory = async (req, res) => {
    const { categoryId } = req.params; // Lấy categoryId từ params

    try {
        // Kiểm tra xem Category có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }

        // Lấy tất cả sản phẩm theo categoryId
        const products = await Product.find({ categoryID: new mongoose.Types.ObjectId(categoryId) });

        // Kiểm tra nếu không có sản phẩm trong danh mục
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm trong danh mục này.' });
        }

        // Trả về một mảng với label là tên sản phẩm và value là số lượng đã bán (isSold)
        const result = products.map(product => ({
            label: product.productName,  // Tên sản phẩm
            value: product.isSold       // Số lượng sản phẩm đã bán (isSold)
        }));

        // Trả về dữ liệu thống kê
        res.status(200).json({
            categoryName: category.categoryName,  // Tên danh mục
            products: result,  // Danh sách sản phẩm với tên và số lượng đã bán
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi khi lấy dữ liệu thống kê.' });
    }
};






