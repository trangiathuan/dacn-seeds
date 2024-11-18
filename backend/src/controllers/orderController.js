const Order = require('../models/order'); // Đảm bảo đường dẫn này đúng
const CartItem = require('../models/cartItem'); // Đảm bảo đường dẫn này đúng
const Product = require('../models/product')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Hoặc dịch vụ email bạn sử dụng
    auth: {
        user: 'trangiathuan8223@gmail.com', // Email của bạn
        pass: 'spyh ugmo nvch dhtb', // Mật khẩu email
    },
});

exports.checkout = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { fullName, email, phoneNumber, addDress, items, totalPrice, paymentMethod } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        const order = new Order({
            userId,
            fullName,
            email,
            phoneNumber,
            addDress,
            paymentMethod,
            items: items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalPrice
        });

        await order.save();

        // Cập nhật số lượng sản phẩm
        for (const item of items) {
            const product = await Product.findById(item.productId);

            // Kiểm tra xem sản phẩm có đủ số lượng không
            if (product && product.quantity >= item.quantity) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { quantity: -item.quantity }
                });
            } else {
                // Nếu không đủ số lượng, có thể trả về lỗi
                return res.status(400).json({ message: `Sản phẩm ${item.productName} không đủ số lượng` });
            }
        }

        await CartItem.deleteMany({ userId });

        const adminMailOptions = {
            from: 'trangiathuan8223@gmail.com', // Địa chỉ email đã xác minh
            to: 'trangiathuan8223@gmail.com', // Email của bạn
            subject: 'THÔNG BÁO ĐƠN HÀNG MỚI',
            html: `
                <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <h1 style="color: #333; text-align: center;">Chi tiết đơn hàng</h1>
                    <p style="font-size: 16px;">Có một đơn hàng mới từ <strong>${fullName}</strong>.</p>
                    <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
                    <p><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    <p><strong>Email khách hàng:</strong> ${email}</p>
                    <p><strong>Số điện thoại:</strong> ${phoneNumber}</p>
                    <p><strong>Địa chỉ nhận hàng:</strong> ${addDress}</p>
                    <h2 style="color: #333;">Chi tiết sản phẩm:</h2>
                    <ul style="list-style-type: none; padding: 0;">
                        ${items.map(item => `
                            <li style="margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px; display: flex; align-items: center;">
                                <img src="https://raw.githubusercontent.com/trangiathuan/dacn-seeds/main/frontend/src/asset/images-product/${item.image}" alt="${item.productName}" style="width: 100px; height: auto; margin-right: 10px;"/>
                                <div>
                                    <strong>${item.productName}</strong><br/>
                                    <span> Số lượng: ${item.quantity} <br/> Giá: ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `,
        };

        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ message: 'Thanh toán thành công', orderId: order._id });
    } catch (err) {
        console.error("Error during checkout process:", err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.checkoutGuest = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, addDress, items, totalPrice, paymentMethod } = req.body;

        // Kiểm tra thông tin yêu cầu
        if (!fullName || !email || !phoneNumber || !addDress || !items || !totalPrice) {
            return res.status(400).json({ message: 'Thiếu thông tin yêu cầu' });
        }

        const order = new Order({
            fullName,
            email,
            phoneNumber,
            addDress,
            paymentMethod,
            items: items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalPrice
        });

        await order.save();

        // Cập nhật số lượng sản phẩm
        for (const item of items) {
            const product = await Product.findById(item.productId);

            // Kiểm tra xem sản phẩm có đủ số lượng không
            if (product && product.quantity >= item.quantity) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { quantity: -item.quantity }
                });
            } else {
                // Nếu không đủ số lượng, có thể trả về lỗi
                return res.status(400).json({ message: `Sản phẩm ${item.productName} không đủ số lượng` });
            }
        }

        // Gửi email thông báo cho admin
        const adminMailOptions = {
            from: 'trangiathuan8223@gmail.com', // Địa chỉ email đã xác minh
            to: 'trangiathuan8223@gmail.com', // Email của bạn
            subject: 'THÔNG BÁO ĐƠN HÀNG MỚI',
            html: `
                <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <h1 style="color: #333; text-align: center;">Chi tiết đơn hàng</h1>
                    <p style="font-size: 16px;">Có một đơn hàng mới từ <strong>${fullName}</strong>.</p>
                    <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
                    <p><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    <p><strong>Email khách hàng:</strong> ${email}</p>
                    <p><strong>Số điện thoại:</strong> ${phoneNumber}</p>
                    <p><strong>Địa chỉ nhận hàng:</strong> ${addDress}</p>
                    <h2 style="color: #333;">Chi tiết sản phẩm:</h2>
                    <ul style="list-style-type: none; padding: 0;">
                        ${items.map(item => `
                            <li style="margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px; display: flex; align-items: center;">
                                <img src="https://raw.githubusercontent.com/trangiathuan/dacn-seeds/main/frontend/src/asset/images-product/${item.image}" alt="${item.productName}" style="width: 100px; height: auto; margin-right: 10px;"/>
                                <div>
                                    <strong>${item.productName}</strong><br/>
                                    <span> Số lượng: ${item.quantity} <br/> Giá: ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `,
        };

        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ message: 'Thanh toán thành công', orderId: order._id });
    } catch (err) {
        console.error("Error during guest checkout process:", err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};



exports.userOrder = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({ message: 'Tài khoản không tồn tại' });
    }

    try {

        const response = await Order.find({ userId: userId }).sort({ createdAt: -1 });

        if (response.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào.' });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu đơn hàng.' });
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Kiểm tra trạng thái có hợp lệ hay không
        const validStatuses = [-1, 0, 1, 2, 3, 4];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        // Tìm đơn hàng theo ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;
        const updatedOrder = await order.save();

        // Nếu trạng thái được cập nhật thành '4' (hoàn tất)
        if (status === 4) {
            for (let item of updatedOrder.items) {
                // Cập nhật trường 'isSold' của sản phẩm
                const product = await Product.findById(item.productId);
                if (product) {
                    // Cộng thêm số lượng đã bán vào trường isSold
                    product.isSold = (product.isSold || 0) + item.quantity;
                    await product.save();
                }
            }
        }

        res.status(200).json({ message: 'Cập nhật trạng thái thành công', order: updatedOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
    }
};

exports.cancelOrder = async (req, res) => {
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
