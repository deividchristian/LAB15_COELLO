const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authorizeRoles } = require('../middlewares/auth');

// Rutas públicas (CUSTOMER y ADMIN pueden ver)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (Solo ADMIN)
router.post('/', authorizeRoles('ADMIN'), productController.createProduct);
router.put('/:id', authorizeRoles('ADMIN'), productController.updateProduct);
router.delete('/:id', authorizeRoles('ADMIN'), productController.deleteProduct);

module.exports = router;