// Centralizar todas las rutas

const { Router } = require('express');
const app = Router();
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

module.exports = app;