const express = require('express');
const router = express.Router();
const commentBlogController = require('../controllers/blogCommentController'); // Import Comment model
const authUser = require('../middleware/authUser');

router.get('/comments/:blogId', commentBlogController.getComments);  // Lấy bình luận theo blogId
router.post('/comments', authUser, commentBlogController.createComment);

module.exports = router;
