const express = require('express');
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../handlers/product');
const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getOneProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
