/* 
See full documentation in the file Tutorial.txt

Based on turtorial:
https://www.youtube.com/watch?v=srPXMt1Q0nY&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q
*/

console.log('NATALINGO server restarted!');

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')

//const password = process.env.MONGO_ATLAS_PW;
const username = 'node-shop';
const password = 'node-shop';
const uri = `mongodb+srv://${username}:${password}@node-rest-shop.u9ymick.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop`;
// https://stackoverflow.com/questions/54494490/how-to-fix-warning-the-usemongoclient-option-is-no-longer-necessary-in-mongo

mongoose.connect(uri);
// Fix deprecation warning, video #7 (17:25): https://youtu.be/CMDsTMV2AgI?feature=shared&t=1045
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
        // Prevent CORS errors (default browser security restrictions) by adding headers to all of the responses
        // In the second argument define specific allowed origins ('http://...'), or '*' to allow all origins to use this REST api
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        // Check if this is just a request for the allowed methods in this REST api
        if (req.method === 'OPTIONS') {
                // Declare allowed methods in this REST api
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                // Returm a response to avoid routing in the case of a request for the allowed methods in this REST api
                return res.status(200).json({});
        }
        // Continue handling this request by passing to the next function
        next();
});

// Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
        const error = new Error('Bad Request - Route not found');
        error.status = 400;
        // Continue handling this request by passing the 'error' constant to the next function
        next(error);
})

app.use((error, req, res, next) => {
        console.log(`\nError ${error.status || 500}: `,error.message || 'Critical error!', '\n\n'/* , error, '\n\n' */)
        res.status(error.status || 500);
        res.json({
                message: error.message
        });
});

module.exports = app;