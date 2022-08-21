const path = require('path');
const fs = require('fs');
const { response } = require('express');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { User, Product } = require('../models');
const { uploadFile } = require('../helpers');

const uploadFiles = async (req, res = response) => {
  try {
    // Imágenes
    // const name = await uploadFile( req.files, ['txt', 'md'], 'textos' );
    const name = await uploadFile( req.files, undefined, 'images' );
    return res.json({ ok: true, name });
  } catch (error) {
    return res.status(400).json({ ok: false, error });
  }

};

const updateFile = async (req, res = response) => {

  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if ( !model ) {
        return res.status(400).json({ ok: false, msg: `El usuario con id ${id} no existe` });
      }
      break;
      case 'products':
      model = await Product.findById(id);
      if ( !model ) {
        return res.status(400).json({ ok: false, msg: `El producto con id ${id} no existe` });
      }
    break;
    default:
    return res.status(501).json({ ok: false, msg: 'Colección no implementada.' });
  }

  // Limpiar imagenes previas
  if ( model.img ) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads/', collection, model.img );
    if ( fs.existsSync( pathImagen ) ) {
      fs.unlinkSync( pathImagen );
    }
  }

  const name = await uploadFile( req.files, undefined, collection );
  model.img = await name;

  await model.save();

  res.json({ ok: true, msg: 'Imagen actualizada correctamente.', result: model });
};

const getFile = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if ( !model ) {
        return res.status(400).json({ ok: false, msg: `El usuario con id ${id} no existe` });
      }
    break;

    case 'products':
      model = await Product.findById(id);
      if ( !model ) {
        return res.status(400).json({ ok: false, msg: `El producto con id ${id} no existe` });
      }
    break;

    default:
    return res.status(501).json({ ok: false, msg: 'Colección no implementada.' });
  }

  // Limpiar imagenes previas
  if ( model.img ) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads/', collection, model.img );
    if ( fs.existsSync( pathImagen ) ) {
      return res.sendFile( pathImagen );
    }
  }

  const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
  if ( fs.existsSync( pathImagen ) ) {
    return res.sendFile( pathImagen );
  }
  return res.status(501).json({ ok: false, msg: 'Imagen no por defecto no encontrada.' });
};

const updateFileCloudinary = async (req, res = response) => {

  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if ( !model ) {
        return res.status(400).json({ ok: false, msg: `El usuario con id ${id} no existe` });
      }
    break;
     
    case 'products':
      model = await Product.findById(id);
      if ( !model ) {
        return res.status(400).json({ ok: false, msg: `El producto con id ${id} no existe` });
      }
    break;
    
    default:
    return res.status(501).json({ ok: false, msg: 'Colección no implementada.' });
  }

  // Limpiar imagenes previas
  if ( model.img ) {
    const nameArr = model.img.split('/');
    const name = nameArr[ nameArr.length - 1 ];
    const [ publicId ] = name.split('.');

    await cloudinary.uploader.destroy( publicId );
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
  model.img = secure_url;

  await model.save();

  res.json({ ok: true, msg: 'Imagen actualizada correctamente.', result: model });
};


module.exports = {
  uploadFiles,
  updateFile,
  getFile,
  updateFileCloudinary
};