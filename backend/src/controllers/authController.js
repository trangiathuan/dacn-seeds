const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

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
            return res.status(400).json({ message: "Tên tài khoản hoặc email đã tồn tại" });
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

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        // Lấy thông tin userId từ params hoặc từ token nếu bạn dùng xác thực JWT
        const userId = req.params.id;

        // Lấy thông tin mới từ body request
        const { fullName, birthDay, email, phoneNumber, address } = req.body;

        // Kiểm tra xem có thông tin nào bị thiếu không
        if (!fullName || !birthDay || !email || !phoneNumber || !address) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết để cập nhật' });
        }

        // Tìm người dùng bằng userId
        const user = await User.findById(userId);

        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin người dùng
        user.fullName = fullName;
        user.birthDay = birthDay;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.address = address;

        // Lưu người dùng sau khi cập nhật
        const updatedUser = await user.save();

        // Trả về thông tin người dùng sau khi cập nhật
        res.json({
            message: 'Cập nhật thông tin người dùng thành công',
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin' });
    }
};

const bcrypt = require('bcryptjs'); // Nếu chưa cài, bạn cần cài bcryptjs để băm mật khẩu

// Cập nhật mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Kiểm tra xem tất cả các trường có được cung cấp hay không
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: 'Thiếu thông tin mật khẩu cần thiết' });
        }

        // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu mới có khớp hay không
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Kiểm tra mật khẩu cũ có đúng không
        const isMatch = await user.isValidPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        // Băm mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới vào người dùng
        user.passWord = hashedPassword;

        // Lưu thông tin người dùng với mật khẩu mới
        await user.save();

        // Trả về thông báo thành công
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật mật khẩu' });
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Hoặc dịch vụ email bạn sử dụng
    auth: {
        user: 'trangiathuan8223@gmail.com', // Email của bạn
        pass: 'spyh ugmo nvch dhtb', // Mật khẩu email
    },
});

// Hàm tạo mật khẩu ngẫu nhiên
const generateRandomPassword = () => {
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Hàm reset mật khẩu và băm mật khẩu mới
const resetPassword = async (user) => {
    const newPassword = generateRandomPassword();

    // Băm mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu vào cơ sở dữ liệu
    user.passWord = hashedPassword;
    await user.save();

    return newPassword;
};

// Hàm gửi email mật khẩu mới
const sendResetPasswordEmail = async (email, newPassword) => {
    const mailOptions = {
        from: 'trangiathuan8223@gmail.com',
        to: email,
        subject: 'Seed Plant - Khôi phục mật khẩu',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 30px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style=" font-size: 36px; margin: 0;">Mật khẩu mới</h1>
                    </div>
                    <div style="font-size: 16px; color: #333333; line-height: 1.6; text-align: center;">
                        <p style="margin: 10px 0;">Chúng tôi đã nhận được yêu cầu lấy lại mật khẩu cho tài khoản của bạn. Mật khẩu mới của bạn là:</p>
                        <p style="margin: 10px 0; font-size: 18px; font-weight: bold; text-align: center; ">${newPassword}</p>
                        <p style="margin: 10px 0;">Vui lòng đăng nhập vào tài khoản của bạn và thay đổi mật khẩu để đảm bảo an toàn và bảo mật cho tài khoản.</p>
                        <p style="margin: 10px 0;">Nhấn vào nút bên dưới để đăng nhập ngay:</p>
                        <!-- Nút button với màu xanh dương -->
                        <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">
                            Đăng nhập ngay
                        </a>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #888888; margin-top: 20px;">
                        <p style="margin: 5px 0;">Bạn nhận được email này vì đã yêu cầu thay đổi mật khẩu. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                        <p style="margin: 5px 0;">&copy; 2024 Công ty hạt giống Seed Plant</p>
                    </div>
                </div>
            </body>
        </html>
        `,
    };


    return transporter.sendMail(mailOptions);
};

// API quên mật khẩu
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
        }

        // Reset mật khẩu và băm mật khẩu mới
        const newPassword = await resetPassword(user);

        // Gửi email với mật khẩu mới
        await sendResetPasswordEmail(user.email, newPassword);

        return res.status(200).json({ message: 'Mật khẩu mới đã được gửi tới email của bạn.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã có lỗi xảy ra, vui lòng thử lại!' });
    }
};

