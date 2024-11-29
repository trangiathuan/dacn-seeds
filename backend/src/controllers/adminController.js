const Product = require('../models/product'); // Đường dẫn đến model Product
const Order = require('../models/order');
const User = require('../models/user');
const Blog = require('../models/blog')
const Category = require('../models/category')
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
        const imagePath = req.file ? `${req.file.filename}` : null;

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
            image: imagePath,
            createdAt: Date.now()
        })
        await newProduct.save();
        res.status(200).json({ message: "Sản phẩm đã được tạo thành công", product: newProduct });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = async (req, res) => {
    const { id } = req.params;  // Lấy ID sản phẩm từ URL
    const { productName, categoryID, description, price, quantity, image } = req.body;  // Lấy dữ liệu từ body request

    try {
        // Kiểm tra nếu có file ảnh mới
        let imagePath;

        if (req.file) {
            imagePath = req.file.filename; // Lấy tên ảnh mới từ req.file nếu có
        } else {
            // Nếu không có file ảnh mới, giữ lại ảnh cũ nếu có
            const product = await Product.findById(id); // Tìm sản phẩm theo ID
            imagePath = product ? product.image : null;  // Nếu không có sản phẩm, set imagePath là null
        }

        // Cập nhật sản phẩm trong cơ sở dữ liệu
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productName, categoryID, description, price, quantity, image: imagePath }, // Gửi thông tin và ảnh (nếu có)
            { new: true }  // Trả về document đã được cập nhật
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


//API Order//

//Lấy ra DS đơn hàng 
exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $in: [0] } }) //Hiển thị đơn hàng chưa duyệt và đã duyệt
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

//Lấy ra DS đơn hàng đã xác nhận
exports.getResolvedOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 1 })
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

//Lấy ra DS đơn hàng đang giao
exports.getShipOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 2 })
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

//Lấy ra DS đơn hàng đã bán 
exports.getSoldOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 4 })
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

//Lấy ra DS đơn hàng đã hủy 
exports.getCancelledOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: -1 })
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
        const validStatuses = [-1, 0, 1, 2, 3];
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
        const { orderId, items } = req.body;

        // Tìm đơn hàng theo ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Cập nhật số lượng sản phẩm
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: item.quantity } // Tăng số lượng trở lại dùng toán tử $inc
            });
        }

        await Order.findByIdAndUpdate(orderId, { status: -1 });

        res.status(200).json({ message: 'Đơn hàng đã được hủy thành công' });
    } catch (err) {
        console.error("Error during canceling order:", err);
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
        const total = await Order.countDocuments({ status: 0 });

        // Trả về tổng số lượng đơn hàng "Pending"
        res.status(200).json({ total });
    } catch (err) {
        console.error('Error getting total pending orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.getTotalResolveOrders = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng với status là "Pending"
        const total = await Order.countDocuments({ status: 1 });

        // Trả về tổng số lượng đơn hàng "Pending"
        res.status(200).json({ total });
    } catch (err) {
        console.error('Error getting total pending orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.getTotalShippingOrders = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng với status là "Pending"
        const total = await Order.countDocuments({ status: 2 });

        // Trả về tổng số lượng đơn hàng "Pending"
        res.status(200).json({ total });
    } catch (err) {
        console.error('Error getting total pending orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.getTotalCompletedOrders = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng với status là "Pending"
        const total = await Order.countDocuments({ status: 4 });

        // Trả về tổng số lượng đơn hàng "Pending"
        res.status(200).json({ total });
    } catch (err) {
        console.error('Error getting total pending orders:', err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.getTotalCancelOrders = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm tổng số đơn hàng với status là "Pending"
        const total = await Order.countDocuments({ status: -1 });

        // Trả về tổng số lượng đơn hàng "Pending"
        res.status(200).json({ total });
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

//Blog

exports.getAllBlogAdmin = async (req, res) => {
    try {
        const getBlog = await Blog.find({ isActive: 0 })
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 }); // Sắp xếp theo createdAt giảm dần
        res.status(200).json(getBlog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Có lỗi khi lấy dữ liệu blog' });
    }
};

exports.deleteBlogAdmin = async (req, res) => {
    try {
        const { blogId } = req.body


        const deleteBlog = await Blog.deleteOne({ _id: blogId })

        if (!deleteBlog) {
            return res.status(400).json({ message: 'Blog không tồn tại' })
        }
        else {
            return res.status(200).json({ message: 'Xoá blog thành công' })
        }


    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra' })
    }

}

exports.UpdateStatusBlogAdmin = async (req, res) => {
    try {
        const { blogId } = req.body;
        // Kiểm tra trạng thái có hợp lệ hay không

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { isActive: 1 },
            { new: true } // Trả về đơn hàng đã cập nhật
        );
        if (!blog) {
            return res.status(404).json({ message: 'Không tìm thấy blog' });
        }
        res.status(200).json({ message: 'Cập nhật trạng thái thành công', blog });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
}

//Category

exports.getAllCategory = async (req, res) => {
    try {
        const category = await Category.find()
        res.status(200).json(category)
    } catch {
        console.log("không thể tải dữ liệu loại sản phẩm")
    }
}

exports.addCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const categoryIcon = req.file ? `${req.file.filename}` : 'seed.png';
        const newCategory = new Category({
            categoryName,
            categoryIcon: categoryIcon
        });
        await newCategory.save();
        res.status(200).json({ msg: 'Danh mục đã được thêm thành công', category: newCategory });
    } catch (err) {
        console.error('lỗi nè', err);
        res.status(500).json({ msg: 'Lỗi khi thêm danh mục' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const { id } = req.params;
        console.log('name', categoryName)
        console.log('id nè', id)
        let categoryIcon;
        if (req.file) {
            categoryIcon = `${req.file.filename}`;
        }
        else {
            const category = await Category.findById(id);
            categoryIcon = category.categoryIcon
        }
        const cat = await Category.findByIdAndUpdate(id,
            {
                categoryName,
                categoryIcon: categoryIcon
            },
            { new: true }
        );
        res.status(200).json(cat);
    } catch (err) {
        console.error('lỗi nè', err);
        res.status(500).json({ msg: 'Lỗi khi update danh mục' });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ msg: 'Danh mục đã được xoá thành công.' });
    } catch (error) {
        console.error("Không thể xoá danh mục: ", error);
        res.status(500).json({ msg: 'Lỗi khi xoá danh mục' });
    }
};

