const express = require('express')
const routerAPI = express.Router()
const { getProduct, getProductDetail, getProductCategory } = require('../controllers/productController')

//route product
routerAPI.get('/product', getProduct)
routerAPI.get('/product-detail/:id', getProductDetail)
routerAPI.get('/products-category/:id', getProductCategory)



module.exports = routerAPI