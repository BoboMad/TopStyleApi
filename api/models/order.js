const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },

    products: [
    {
        _id:false,
        product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
        quantity: {
            type: Number, 
            required:true,
        },
    }  
    ],
    totalAmount: {
        type: Number, 
        required:true
    }
});

module.exports = mongoose.model('Order', orderSchema);