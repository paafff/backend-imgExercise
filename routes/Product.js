const express = require('express');
const { createProduct, deleteProduct } = require('../controllers/Product');

const productRouter = express.Router();

productRouter.post('/product', createProduct);
productRouter.delete('/product/:uuid', deleteProduct);

module.exports = productRouter;
