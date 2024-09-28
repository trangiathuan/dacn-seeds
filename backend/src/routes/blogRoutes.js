const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const authUser = require('../middleware/authUser')

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/NTTU/Đồ án chuyên ngành KTPM/Project/frontend/src/asset/blog'); // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Tên file
    },
});

const upload = multer({ storage });
router.post('/blog', authUser, upload.single('image'), blogController.postBlog)