const { request, response } = require('express');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

const JWTValidator = async( req = request, res = response, next ) => {
  const token = req.header('x-token');

  if ( !token ) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    })
  }

  try {

    const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
    const user = await User.findById( uid );

    if ( !user ) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe'
      }); 
    }

    // Verificar si el uid tiene estado true
    if ( !user.state ) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con state false'
      });
    }

    req.user = user; 

    next();
  } catch(error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido'
    })
  }
  
}

module.exports = { JWTValidator };