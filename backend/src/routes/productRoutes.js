const express = require('express')
const routerAPI = express.Router()
const { getProduct, postCreateProduct, getProductDetail, getProductCategory } = require('../controllers/productController')

//route product
routerAPI.get('/product', getProduct)
routerAPI.post('/product', postCreateProduct)
routerAPI.get('/product-detail/:id', getProductDetail)
routerAPI.get('/products-category/:id', getProductCategory)



module.exports = routerAPI