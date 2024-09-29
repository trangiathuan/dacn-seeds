const mongoose = require('mongoose');

// Định nghĩa schema cho blog
const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    image: {
        type: String,
        required: false // Thay đổi thành true nếu cần thiết
    },
    totalLike: {
        type: Number,
        required: true,
        default: 0
    },
    likers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Tạo model từ schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
