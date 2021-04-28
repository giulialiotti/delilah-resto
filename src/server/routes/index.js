// Centralizar todas las rutas

const { Router } = require('express');
const app = Router();
const productsRoutes = require('./products');

app.use('/products', productsRoutes);

module.exports = app;