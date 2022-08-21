const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/User');

const { generarJWT } = require('../helpers/jwt-generator');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

  const { email, password } = req.body;

  try {

    // Verificar si el email existe
    const user = await User.findOne({ email });
    
    if ( !user ) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - email'
      });
    }

    // Si el usuario está activo
    if ( !user.state ) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado'
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if ( !validPassword ) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    // General el JWT
    const token = await generarJWT( user.id );

    res.json({
      user,
      token
    });

  } catch(error) {
    
    console.log(error);
    
    return res.status(500).json({
      msg: 'Hable con el administrador'
    });

  }
};

const googleSignIn = async (req, res = response) => {
  
  const { id_token } = req.body;

  try {
    const { name, picture, email } = await googleVerify( id_token );

    let user = await User.findOne({ email });  
    
    if ( !user ) {
      //Tengo que crearlo
      const data = {
        name,
        email,
        password: 'null',
        image: picture,
        google: true,
        role: 'USER_ROLE'
      };

      user = new User( data );
      await user.save();
    }

    if ( !user.state ) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      })
    }

    // General el JWT
    const token = await generarJWT( user.id );

    res.json({
      user,
      token
    });

  } catch(error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    });
  }
};

const renewToken = async (req, res = response) => {
  const { user } = req;

  // Generar JWT
  const token = await generarJWT( user.id );

  res.json({
    user,
    token
  });
};

module.exports = { login, googleSignIn, renewToken }