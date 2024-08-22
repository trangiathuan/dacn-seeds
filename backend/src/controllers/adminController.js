const Product = require('../models/product'); // Đường dẫn đến model Product
const Order = require('../models/order');
const User = require('../models/user');
const { param } = require('../routes/adminRoutes');

exports.checkAdmin = async (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin dashboard' });
}
exports.getAllProducts = async (req, res) => {
    try {
        // Sử dụng populate để thay categoryID bằng categoryName
        const products = await Product.find().populate('categoryID', 'categoryName');
        res.status(200).json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

exports.addProduct = async (req, res) => {
    const { productName, categoryID, description, price, quantity, image } = req.body;
    try {
        const existingProduct = await Product.findOne({ productName })
        if (existingProduct) {
            return res.status(400).json({ message: " Sản phẩm này đã tồn tại" });
        }
        const newProduct = new Product({
            productName,
            categoryID,
            description,
            price,
            quantity,
            image
        })
        await newProduct.save();
        res.status(201).json({ message: "Sản phẩm đã được tạo thành công", product: newProduct });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = async (req, res) => {
    const { id } = req.params;  // Lấy ID sản phẩm từ URL
    const { productName, categoryID, description, price, quantity, image } = req.body;  // Lấy dữ liệu từ body request

    try {
        // Tìm và cập nhật sản phẩm dựa trên ID
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productName, categoryID, description, price, quantity, image },
            { new: true }  // Tùy chọn này trả về document đã được cập nhật
        );

        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json(updatedProduct);  // Trả về sản phẩm đã cập nhật
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
exports.getProductId = async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL

    try {
        const product = await Product.findById(id); // Tìm sản phẩm theo ID

        if (!product) {
            return res.status(404).json({ msg: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json(product); // Trả về thông tin sản phẩm
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL

    try {
        const product = await Product.findByIdAndDelete(id); // Tìm và xóa sản phẩm theo ID

        if (!product) {
            return res.status(404).json({ msg: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ msg: 'Sản phẩm đã được xóa thành công' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

exports.getTotalProducts = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng
        const totalProducts = await Product.countDocuments();

        // Trả về tổng số lượng đơn hàng
        res.status(200).json({ totalProducts });
    } catch (err) {
        console.error('Error getting total orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};







exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        // Kiểm tra trạng thái có hợp lệ hay không
        const validStatuses = ['Đang chờ duyệt', 'Đã duyệt', 'Đã giao', 'Đã hủy'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }
        // Tìm đơn hàng theo ID và cập nhật trạng thái
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true } // Trả về đơn hàng đã cập nhật
        );
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.status(200).json({ message: 'Cập nhật trạng thái thành công', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Tìm và xóa đơn hàng theo orderId
        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        res.status(200).json({ message: 'Đã xóa đơn hàng thành công', order });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.getTotalOrders = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng
        const totalOrders = await Order.countDocuments();

        // Trả về tổng số lượng đơn hàng
        res.status(200).json({ totalOrders });
    } catch (err) {
        console.error('Error getting total orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};
exports.getTotalPendingOrders = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng với status là "Pending"
        const totalPendingOrders = await Order.countDocuments({ status: 'Đang chờ duyệt' });

        // Trả về tổng số lượng đơn hàng "Pending"
        res.status(200).json({ totalPendingOrders });
    } catch (err) {
        console.error('Error getting total pending orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};




exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { userId, role } = req.body;

    try {
        // Tìm người dùng theo ID và cập nhật role
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true } // Trả về user đã cập nhật và kiểm tra validation
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getTotalUsers = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng
        const totalUsers = await User.countDocuments();

        // Trả về tổng số lượng đơn hàng
        res.status(200).json({ totalUsers });
    } catch (err) {
        console.error('Error getting total orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};