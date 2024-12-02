// commentController.js
const CommentBlog = require('../models/commentBlog');  // Model commentBlog

// API để lấy bình luận theo blogId
exports.getComments = async (req, res) => {
    try {
        const comments = await CommentBlog.find({ blogId: req.params.blogId })
            .populate('userId', 'fullName')  // Lấy tên người dùng
            .sort({ createdAt: -1 });  // Sắp xếp bình luận theo thời gian
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy bình luận', error });
    }
};

// API để thêm bình luận
exports.createComment = async (req, res) => {

    const { blogId, content } = req.body;
    const userId = req.user.userId

    if (!content) {
        return res.status(400).json({ message: 'Bình luận không được để trống' });
    }

    try {
        const newComment = new CommentBlog({
            blogId,
            userId,
            content,
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo bình luận', error });
    }
};


