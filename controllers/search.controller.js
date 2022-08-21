const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const availableCollections = [ 'categories', 'products', 'roles', 'users' ];

const searchUsers = async ( q = '', res = response ) => {

  const isMongoId = ObjectId.isValid( q );

  if ( isMongoId ) {
    const user = await User.findById( q );
    return res.json({
      ok: true,
      results: ( user ) ? [ user ] : []
    });
  }

  const regex = new RegExp( q, 'i' );
  const user = await User.find({
    $or: [ { name: regex }, { email: regex } ],
    $and: [ { state: true } ]
  });

  return res.json({
    ok: true,
    results: user
  });
};

const searchProducts = async ( q = '', res = response ) => {  
  const isMongoId = ObjectId.isValid( q );

  if ( isMongoId ) {
    const product = await Product.findById( q ).populate('category', 'name');
    return res.json({
      ok: true,
      results: ( product ) ? [ product ] : []
    });
  }

  const regex = new RegExp( q, 'i' );
  const product = await Product.find({ name: regex, status: true }).populate('category', 'name');

  return res.json({
    ok: true,
    results: product
  });
};

const searchCategories = async ( q = '', res = response ) => {
  const isMongoId = ObjectId.isValid( q );

  if ( isMongoId ) {
    const category = await Category.findById( q );
    return res.json({
      ok: true,
      results: ( category ) ? [ category ] : []
    });
  }

  const regex = new RegExp( q, 'i' );
  const category = await Category.find({ name: regex, status: true });

  return res.json({
    ok: true,
    results: category
  });
};

const search = ( req, res = response ) => {
  try {
    const { collection, q } = req.params;

    if ( !availableCollections.includes( collection ) ) {
      return res.status(400).json({
        ok: false,
        message: `Las colecciones permitidas son ${ availableCollections }`,
      });
    }

    switch( collection ) {
      case 'categories':
        searchCategories( q, res );
      break;

      case 'products':
        searchProducts( q, res );
      break;

      case 'users':
        searchUsers( q, res );
      break;

      default:
        return res.status(500).json({
          ok: false,
          msg: 'Se me olvido hacer esta busqueda'
        });
    }

  } catch (error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
};

module.exports = {
  search
};