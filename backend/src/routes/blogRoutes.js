const express = require('express');
const router = express.Router();
const multer = require('multer');
const blogController = require('../controllers/blogController');
const authUser = require('../middleware/authUser');
const path = require('path');

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../frontend/src/asset/blog'); // Đường dẫn lưu file
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Đặt tên file với timestamp và thay thế khoảng trắng
        const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

// Đăng ký các route
router.post('/blog', authUser, upload.single('image'), blogController.postBlog);
router.get('/getAllBlog', blogController.getAllBlog);
router.post('/like', authUser, blogController.likeBlog)
router.delete('/deleteBlog', authUser, blogController.deleteBlog)

module.exports = router;
