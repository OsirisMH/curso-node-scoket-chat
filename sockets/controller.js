const { Socket } = require('socket.io');
const { verifyJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async ( socket = new Socket, io ) => {  
  const user = await verifyJWT( socket.handshake.headers['x-token'] );
  if ( !user ) {
    socket.disconnect();
  }

  // Agregar al usuario conectado
  chatMessages.connectUser( user );
  io.emit('usuarios-activos', chatMessages.usersArr);
  socket.emit('recibir-mensajes', chatMessages.last10);

  // Conectarlo a una sala especial
  socket.join( user.id ); // salas: global, socket.id, usuario.id

  // Limpiar cuando alguien se desconecta
  socket.on( 'disconnect', () => {
    chatMessages.disconnectUser( user.id );
    io.emit('usuarios-activos', chatMessages.usersArr);
  });

  socket.on('enviar-mensaje', ({ uid, mensaje }) => {

    if ( uid ) {
      // Mensaje privado
      socket.to( uid ).emit('mensaje-privado', { from: user.name, message: mensaje });

    } else {
      chatMessages.sendMessage( user.id, user.name, mensaje );
      io.emit('recibir-mensajes', chatMessages.last10);
    }
  });
}

module.exports = {
  socketController
}