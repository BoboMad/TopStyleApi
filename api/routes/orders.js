const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', async (req, res, next) =>{
    try{
    const orders = await Order.find()
    .populate('products.product', 'name price')
    .exec();

    if(!orders || !orders.length){
        return res.status(404).json({ error: `No orders found` });
    }

    res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json({
            error:err.message
        });
    }
    
});

router.post('/', async (req, res, next) =>{
    try{
        const orderData = req.body;

        if (!Array.isArray(orderData)) {
            return res.status(400).json({ error: 'Invalid order data. It should be an array of objects.' });
          }


        let totalAmount = 0;
        const productsArray = [];

        for(const orderItem of orderData){
            const productId = orderItem._id;
            const quantity = orderItem.quantity;

            if (!productId || !quantity) {
                return res.status(400).json({ error: 'Product ID and quantity are required for each item.' });
              }

            const product = await Product.findById(productId);
            // if (!product) {
            //     return res.status(404).json({ error: `Product with ID ${productId} not found.` });
            //   }

            const itemTotal = quantity * product.price;
            totalAmount += itemTotal;

            productsArray.push({
                product:new mongoose.Types.ObjectId(productId),
                quantity: quantity
            });
        }

        const newOrder = new Order({
            _id: new mongoose.Types.ObjectId(),
            products: productsArray,
            totalAmount: totalAmount
        });
        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: err.message});
    }
});

router.get('/:orderId', async (req, res, next) =>{
    const orderId = req.params.orderId;

    try{
        const order = await Order.findById(orderId)
        .populate('products.product', 'name price')
        .exec();

        if (!order) {
            return res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }

        res.status(200).json(order);
    }
    catch(err){
        res.status(500).json({
            error: err.message
        });
    }
});

router.delete('/:orderId', async (req, res, next) =>{
    const orderId = req.params.orderId;

    try{
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ error: `Order with ID ${orderId} not found.` });
        }

        res.status(200).json({ message: 'Order deleted', deletedOrder });
    }
    catch(err){
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;