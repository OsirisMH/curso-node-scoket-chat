const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const getUser = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query; 
    const query = { state: true };

    // const users = await User.find(query)
    //     .skip( Number(from) )
    //     .limit( Number(limit) );

    // const total = await User.countDocuments(query);

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number(from) )
            .limit( Number(limit) )
    ]);

    res.json({
        total,
        users
    })
};

const postUser = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    res.json({
        user
    });
};

const putUser = async (req, res = response) => {
    
    const { id } = req.params;
    const { _id,  password, google, email, ...rest } = req.body;

    // TODO Validar contra base de datos
    if ( password ) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync( password, salt );   
    }

    const user = await User.findByIdAndUpdate( id, rest )

    res.json(user);
};

const patchUser = (req, res = response) => {
    res.json({
        msg: "patch API - Controlador"
    })
};

const deleteUser = async(req, res = response) => {
    
    const { id } = req.params;

    // Fisicamente borrarlo
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { state: false} );

    res.json( user );
};

module.exports = {
    getUser,
    postUser,
    putUser,
    patchUser,
    deleteUser
}