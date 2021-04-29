// Centralizar todas las rutas

const { Router } = require('express');
const app = Router();

const usersRoutes = require('./users');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

module.exports = app;