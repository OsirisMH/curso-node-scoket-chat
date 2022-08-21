const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require('socket.io')( this.server );


        this.paths = {
            auth: '/api/auth',
            search: '/api/search',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
        }
        
        // Conectar a base de datos
        this.connectDB();
        
        // Middlewares
        this.middlewares();

        // Rutas de mí aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parseo de body
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') );

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true,
        }));
    }

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth.routes') );
        this.app.use( this.paths.search, require('../routes/search.routes') );
        this.app.use( this.paths.categories, require('../routes/category.routes') );
        this.app.use( this.paths.products, require('../routes/product.routes') );
        this.app.use( this.paths.users, require('../routes/user.routes') );
        this.app.use( this.paths.uploads, require('../routes/uploads.routes') );
    }
    
    sockets() {
        this.io.on("connection", ( socket ) => socketController(socket, this.io) );
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;