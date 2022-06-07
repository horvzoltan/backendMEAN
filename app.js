
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
//HTTP request logger
app.use(morgan('tiny'));


const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

//ROUTES
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const ordersRouter = require('./routers/orders');
const usersRouter = require('./routers/users');

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

mongoose
    .connect(connectionString)
    .then(() => {
        console.log('Database connection is ready ✔︎')
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log(api);
    console.log('Server is running ✔︎ on http://localhost:3000');
})