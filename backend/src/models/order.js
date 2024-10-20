const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    addDress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    items: [
        {
            productName: {
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
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 0,
        enum: [-1, 0, 1, 2, 3, 4]
    },

    createdAt: {
        type: Date, default: () => {
            const now = new Date();
            const offset = 7 * 60; // Giờ Việt Nam UTC+7
            return new Date(now.getTime() + offset * 60 * 1000);
        }
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
