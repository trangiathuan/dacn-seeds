const express = require('express');
const router = express.Router();
const { getCategory, getCategoryById } = require('../controllers/categoryController')

//route category
router.get('/category', getCategory)
router.get('/category/:id', getCategoryById)


module.exports = router