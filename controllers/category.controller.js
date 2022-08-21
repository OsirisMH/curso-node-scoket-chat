const { response } = require('express');
const { Category } = require('../models');


/*
 TODO: obtenerCategorias - paginado - total - populate
 TODO: obtenerCategorias - populate {}
 TODO: actualizarCategoria
 TODO: borrarCategoria - status ==> false
*/

const getCategories = async(req, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
          .skip( Number(from) )
          .limit( Number(limit) )
          .populate('user', 'name')
    ]);

    return res.json({ total, categories })
  }
  catch (error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const getCategoryById = async(req, res = response) => {
  try {
    const { id } = req.params;  
    const query = { _id: id, status: true };
    const category = await Category.findOne(query).populate('user', 'name');
    return res.json(category);
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const createCategory = async(req, res = response) => {
  try {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
      return res.status(400).json({
        msg: `La categoria ${ categoryDB.name } ya existe`,
      })
    }

    const data = {
      name,
      user: req.user._id
    }

    const category = new Category( data );
    await category.save();

    return res.status(201).json(category);
  } catch(error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const updateCategory = async(req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, status, user, ...data } = req.body;
    
    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } )
    res.json(category);
  } catch(error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
}

const deleteCategory = async(req, res = response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate( id, { status: false}, { new: true } );
    res.json( category );
  } catch(error) {
    return res.status(500).json({msg: 'Hable con el administrador'});
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory
}