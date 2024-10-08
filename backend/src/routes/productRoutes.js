const express = require('express')
const routerAPI = express.Router()
const { getProduct, postCreateProduct, getProductDetail, getProductCategory, search } = require('../controllers/productController')
const productController = require('../controllers/productController')

//route product
routerAPI.get('/product', getProduct)
routerAPI.post('/product', postCreateProduct)
routerAPI.get('/product-detail/:id', getProductDetail)
routerAPI.get('/products-category/:id', getProductCategory)
routerAPI.get('/search', search)



module.exports = routerAPI