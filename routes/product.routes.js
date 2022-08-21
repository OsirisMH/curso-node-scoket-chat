const { Router } = require('express');
const { check } = require('express-validator');

const {
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const { productExistsById, categoryExistsById } = require('../helpers/db-validators');
const { fieldsValidator, isAdminRole, JWTValidator } = require('../middlewares');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( productExistsById ),
  fieldsValidator
], getProductById);

router.post('/', [
  JWTValidator,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('category', 'No es un id de Mongo').isMongoId(),
  check('category').custom( categoryExistsById ),
  fieldsValidator
], createProduct);

router.put('/:id', [
  JWTValidator,
  // check('category', 'No es un id de Mongo').isMongoId(),
  check('id').custom( productExistsById ),
  fieldsValidator,
], updateProduct);

router.delete('/:id', [
  JWTValidator,
  isAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( productExistsById ),
  fieldsValidator,
], deleteProduct);

module.exports = router;