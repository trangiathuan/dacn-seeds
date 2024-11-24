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
        required: false
    },
    totalLike: {
        type: Number,
        required: true,
        default: 0
    },
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Number,
        default: 0,
        required: true
    }
});

// Tạo model từ schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
