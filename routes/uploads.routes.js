const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFiles, updateFile, getFile, updateFileCloudinary } = require('../controllers/uploads.controller');
const { fieldsValidator, validateFileToUpload } = require('../middlewares');

const { availableCollections } = require('../helpers');

const router = Router();

router.post('/', validateFileToUpload, uploadFiles);

router.put('/:collection/:id', [
  validateFileToUpload,
  check('id', 'El id debe ser un MongoId').isMongoId(),
  check('collection').custom( collection => availableCollections( collection, ['users', 'products'] ) ),
  fieldsValidator,
], updateFileCloudinary);
// ], updateFile);

router.get('/:collection/:id', [
  check('id', 'El id debe ser un MongoId').isMongoId(),
  check('collection').custom( collection => availableCollections( collection, ['users', 'products'] ) ),
  fieldsValidator,
], getFile);

module.exports = router;
