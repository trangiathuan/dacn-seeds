const mongoose = require('mongoose');

const commentBlogSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog', // Liên kết tới blog
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Liên kết tới người dùng
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Tạo model từ schema
const CommentBlog = mongoose.model('CommentBlog', commentBlogSchema);

module.exports = CommentBlog;
