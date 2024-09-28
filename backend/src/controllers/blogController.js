const Blog = require('../models/blog');

exports.postBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.userId;
        if (title == null || content == null) {
            res.status(400).json({ message: 'Không có tiêu đề hoặc nội dung' })
        }

        const imagePath = req.file ? req.file.path : null;

        const newBlog = new Blog({
            user: userId,
            title: title,
            content: content,
            image: imagePath,
            createdAt: Date.now()
        });

        await newBlog.save();

        res.status(200).json({
            message: 'Xử lý thành công',
            blog: newBlog
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tạo blog' });
    }
};


