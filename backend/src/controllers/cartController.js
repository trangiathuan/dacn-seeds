const CartItem = require('../models/cartItem');

// Lấy tất cả các sản phẩm trong giỏ hàng cho người dùng hiện tại
exports.getCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find({ userId: req.user.userId });
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// cập nhật số lượng sản phẩm
exports.updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const cartItem = await CartItem.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { quantity },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    const { productName, image, price, quantity } = req.body;
    try {
        // Tìm kiếm sản phẩm trong giỏ hàng
        const findCartItem = await CartItem.findOne({ productName: productName, userId: req.user.userId });

        if (findCartItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            findCartItem.quantity += quantity; // Tăng số lượng
            await findCartItem.save(); // Lưu thay đổi
            return res.status(200).json(findCartItem); // Trả về item đã cập nhật
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo mới
            const newCartItem = new CartItem({
                productName,
                image,
                price,
                quantity,
                userId: req.user.userId
            });

            await newCartItem.save();
            res.status(201).json(newCartItem);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Thêm sản phẩm vào giỏ hàng
// exports.addToCart = async (req, res) => {
//     const { productName, image, price, quantity } = req.body;

//     try {
//         const newCartItem = new CartItem({
//             productName,
//             image,
//             price,
//             quantity,
//             userId: req.user.userId
//         });

//         await newCartItem.save();
//         res.status(201).json(newCartItem);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };



// Xóa sản phẩm khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
    const { id } = req.params;

    try {
        const cartItem = await CartItem.findOneAndDelete({ _id: id, userId: req.user.userId });
        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

