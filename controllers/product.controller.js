const { response } = require('express');
const { Product } = require('../models');

const getProducts = async(req, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
          .populate('user', 'name')
          .populate('category', 'name')
          .skip( Number(from) )
          .limit( Number(limit) )
    ]);

    return res.json({ total, products })
  }
  catch (error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const getProductById = async(req, res = response) => {
  try {
    const { id } = req.params;  
    const query = { _id: id, status: true };
    const product = await Product.findOne(query)
                            .populate('user', 'name')
                            .populate('category', 'name');
    return res.json(product);
  } catch (error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const createProduct = async(req, res = response) => {
  try {
    const { name, price, description, category } = req.body;

    const productDB = await Product.findOne({ name });

    if ( productDB ) {
      return res.status(400).json({
        msg: `El producto ${ productDB.name } ya existe`,
      })
    }

    const data = {
      name: name.toUpperCase(),
      price,
      description,
      category,
      user: req.user._id
    }

    const product = new Product( data );
    await product.save();

    return res.status(201).json(product);
  } catch(error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const updateProduct = async(req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, status, user, ...data } = req.body;
    
    if ( data.name ) {
      data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } )
    res.json(product);
  } catch(error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const deleteProduct = async(req, res = response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate( id, { status: false}, { new: true } );
    res.json( product );
  } catch(error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}