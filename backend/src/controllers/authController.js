const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Đăng ký người dùng mới
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, passWord, fullName, birthDay, address, phoneNumber, email, role } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(400).json({ message: "Tên tài khoản hoặc Email đã tồn tại" });
        }

        const newUser = new User({
            userName,
            passWord,
            fullName,
            birthDay,
            address,
            phoneNumber,
            email,
            role: role || 'user' // Gán role mặc định là 'user' nếu không có
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, // Thêm role vào payload của token
            'giathuan',
            { expiresIn: '30d' }
        );
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Đăng nhập người dùng
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, passWord } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Tên tài khoản hoặc mật khẩu không đúng" });
        }

        const isMatch = await user.isValidPassword(passWord);
        if (!isMatch) {
            return res.status(400).json({ message: "Tên tài khoản hoặc mật khẩu không đúng" });
        }

        const token = jwt.sign(
            { userId: user._id, userName: user.userName, role: user.role },
            'giathuan',
            { expiresIn: '30d' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
