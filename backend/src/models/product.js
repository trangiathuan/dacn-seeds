const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema Product
const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    categoryID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isSold: {
        type: Number,
        require: false
    }



});

// Tạo model Product
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
