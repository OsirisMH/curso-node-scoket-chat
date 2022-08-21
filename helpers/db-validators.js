const { Category, Product, Role, User } = require("../models");

const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if ( !roleExists ) {
        throw new Error(`El rol ${ role } no está registrado en la BD`);
    }
};

const emailExists = async (email = '') => {
    const emailExists = await User.findOne({ email });
    if ( emailExists ) {
        throw new Error(`El correo: ${ email } ya se encuentra registrado`);
    }
}

const userExistsById = async ( id ) => {
    const userExists = await User.findById( id );
    if ( !userExists ) {
        throw new Error(`El id no existe`);
    }
};

const categoryExistsById = async ( id ) => {
    const categoryExists = await Category.findById( id );
    if ( !categoryExists || !categoryExists.status ) {
        throw new Error(`El id no existe o el registro fue eliminado`);
    }
};

const productExistsById = async ( id ) => {
    const productExists = await Product.findById( id );
    if ( !productExists || !productExists.status ) {
        throw new Error(`El id no existe o el registro fue eliminado`);
    }
};

/**
 * Validar colecciones permitidas
 */

const availableCollections = async ( collection, allowedCollections ) => {
    const isInclude = allowedCollections.includes( collection );
    
    if ( !isInclude ) {
        throw new Error(`La colección ${ collection } no está permitida. Las colecciones permitidas son: ${ allowedCollections }`);
    }

    return true;
};

module.exports = {
    emailExists,
    categoryExistsById,
    isValidRole,
    userExistsById,
    productExistsById,
    availableCollections
}
