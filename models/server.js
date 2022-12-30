const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        
        this.usuariosPath = '/api/usuarios';//Declaramos un string donde estan las rutas, esto esta conectado con la funcion routes() como argumento
        this.authPath = '/api/auth';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la app
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body, cualquier informacion que llegue, sera convertido a json
        this.app.use(express.json());

        //Apuntando al directorio 'public'
        this.app.use(express.static('public'));//El 'use' indica que es un middleware
    }

    routes(){
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.buscarPath, require('../routes/buscar'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));//Middleware para conectar de tal manera con las rutas del archivo users.js
        this.app.use(this.categoriasPath, require('../routes/categorias'));
        this.app.use(this.productosPath, require('../routes/productos'));
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log("Servidor corriendo en el puerto ", this.port)
        });
    }
}

module.exports = Server;
