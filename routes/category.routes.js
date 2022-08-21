const { Router } = require('express');
const { check } = require('express-validator');

const {
  createCategory, 
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

const { categoryExistsById } = require('../helpers/db-validators');
const { fieldsValidator, isAdminRole, JWTValidator } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/category
 */

// Obtener todas las categorias - publico
router.get('/', getCategories);

// * Obtener categoria por id - publico
// * Validar id en un middleware personalizado
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( categoryExistsById ),
  fieldsValidator
], getCategoryById);

// Crear categoria - privado para cualquier rol
router.post('/', [
  JWTValidator,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  // check('id').custom( categoryExistsById ),
  fieldsValidator
], createCategory);

// Actualizar categoria por id - privado para cualquier rol
router.put('/:id', [
  JWTValidator,
  check('id', 'No es un ID válido').isMongoId(),
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('id').custom( categoryExistsById ),
  fieldsValidator,
], updateCategory);

// Eliminar (active to inactive) categoria por id - privado para admin
router.delete('/:id', [
  JWTValidator,
  isAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( categoryExistsById ),
  fieldsValidator,
], deleteCategory);

module.exports = router;