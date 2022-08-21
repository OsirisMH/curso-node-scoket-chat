const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, availablesExtensions = ['png', 'jpg', 'gif', 'jpeg'], directory = '' ) => {
  return new Promise( (resolve, reject) => {
    const { archivo } = files;
    const shortName = archivo.name.split('.');
    const extension = shortName[shortName.length - 1];
  
    // Validar la extensión del archivo
    if ( !availablesExtensions.includes(extension) ) {
      return reject(`La extensión ${ extension } no es válida. Extensiones válidas ${ availablesExtensions }`);
    }
  
    const tempName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', directory, tempName);
  
    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
  
      return resolve(tempName);
    });
  });
};

module.exports = { uploadFile };