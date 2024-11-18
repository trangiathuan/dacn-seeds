const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    passWord: { type: String, required: true },
    fullName: { type: String, required: true },
    birthDay: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    try {
        if (this.isNew && this.isModified('passWord')) {  // Chỉ băm khi là người dùng mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.passWord, salt);
            this.passWord = hashedPassword;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Hàm kiểm tra mật khẩu
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.passWord);
    } catch (err) {
        throw err;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
