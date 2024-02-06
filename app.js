const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT;

// Handle incoming GET requests
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://Bobo:'+ process.env.MONGO_ATLAS_PW +'@cluster0.djv5jr6.mongodb.net/?retryWrites=true&w=majority'
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

//mongoose.connect('mongodb+srv://Bobo:'+ process.env.MONGO_ATLAS_PW +'@cluster0.djv5jr6.mongodb.net/?retryWrites=true&w=majority'
//);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if( req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes wich should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);


app.use((req, res, next) =>{
    const error  = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});

module.exports = app;
