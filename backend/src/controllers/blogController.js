const Blog = require('../models/blog');

exports.postBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.userId;

        // Kiểm tra tiêu đề và nội dung
        if (!title || !content) {
            return res.status(400).json({ message: 'Không có tiêu đề hoặc nội dung' });
        }

        // Lưu đường dẫn hình ảnh tương đối
        const imagePath = req.file ? `${req.file.filename}` : null;

        const newBlog = new Blog({
            userId: userId,
            title: title,
            content: content,
            image: imagePath, // Lưu đường dẫn hình ảnh tương đối
            createdAt: Date.now(),
        });

        await newBlog.save();

        res.status(200).json({
            message: 'Xử lý thành công',
            blog: newBlog,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tạo blog' });
    }
};

exports.getAllBlog = async (req, res) => {
    try {
        const getBlog = await Blog.find({ isActive: 1 })
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 }); // Sắp xếp theo createdAt giảm dần
        res.status(200).json(getBlog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Có lỗi khi lấy dữ liệu blog' });
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const { blogId } = req.body; // ID của blog cần like
        const userId = req.user.userId; // Lấy userId từ token

        // Tìm blog theo ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog không tồn tại' });
        }

        // Kiểm tra nếu người dùng đã like blog chưa
        const userHasLiked = blog.likers.includes(userId);

        if (!userHasLiked) {
            // Nếu chưa like, thêm userId vào danh sách likers và tăng totalLike
            blog.likers.push(userId);
            blog.totalLike += 1; // Tăng tổng số lượt like
        } else {
            // Nếu đã like, loại bỏ userId khỏi danh sách likers và giảm totalLike
            blog.likers = blog.likers.filter(id => id.toString() !== userId.toString());
            blog.totalLike -= 1; // Giảm tổng số lượt like
        }

        // Lưu lại blog đã cập nhật
        await blog.save();

        res.status(200).json({
            message: 'Xử lý thành công',
            totalLike: blog.totalLike, // Trả về tổng số lượt like
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý like' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.body
        const userId = req.user.userId

        const blog = await Blog.findOne({ _id: blogId });

        if (!blog || blog.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa blog này' });
        }

        const deleteBlog = await Blog.deleteOne({ _id: blogId, userId: userId })

        if (!deleteBlog) {
            return res.status(400).json({ message: 'Blog không tồn tại' })
        }
        else {
            return res.status(200).json({ message: 'Xoá blog thành công' })
        }


    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra' })
    }

}




