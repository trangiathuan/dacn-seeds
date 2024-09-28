const mongoose = require('mongoose');

// Định nghĩa schema cho blog
const blogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Liên kết với user
        ref: 'User', // Tên model user
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Ngày đăng mặc định là thời điểm hiện tại 
    }
});

// Tạo model từ schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;