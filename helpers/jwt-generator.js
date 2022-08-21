const jwt = require('jsonwebtoken');
const { User } = require('../models')

const generarJWT = ( uid = '' ) => {
  return new Promise( (resolve, reject) => {
    const payload = { uid };

    jwt.sign( payload, process.env.SECRETPRIVATEKEY, {
      expiresIn: '4h'
    }, (error, token) => {
      if ( error ) {
        console.log( error );
        reject( 'No se pudo generar el token' );
      }
      else {
        resolve( token );
      }
    });
  });
}

const verifyJWT = async (token = '') => {
  try {
    
    if ( token.length < 10 ) {
      return null;
    }

    const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
    const user = await User.findById( uid );

    if ( user ) {
      if ( user.state ) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }

  } catch ( error ) {
    return null;
  }
}

module.exports = {
  generarJWT,
  verifyJWT
}