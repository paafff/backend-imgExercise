const express = require('express');
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductById,
} = require('../controllers/Product');

const productRouter = express.Router();

productRouter.post('/product', createProduct);
productRouter.patch('/product/:uuid', updateProduct);
productRouter.delete('/product/:uuid', deleteProduct);
productRouter.get('/products', getProducts);
productRouter.get('/product/:uuid', getProductById);

module.exports = productRouter;
