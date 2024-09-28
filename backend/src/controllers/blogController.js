const Blog = require('../models/blog')

exports.postBlog = async (req, res) => {
    try {
        const { title, content } = req.body
        const { userId } = req.user.userId
        const newBlog = await createCollection
    }
    catch (err) {

    }
}