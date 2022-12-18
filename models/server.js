const express = require('express');
const cors = require('cors');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';//Declaramos un string donde estan las rutas, esto esta conectado con la funcion routes() como argumento

        //Middlewares
        this.middlewares();

        //Rutas de la app
        this.routes();
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
        this.app.use(this.usuariosPath, require('../routes/usuarios'));//Middleware para conectar de tal manera con las rutas del archivo users.js
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log("Servidor corriendo en el puerto ", this.port)
        });
    }
}

module.exports = Server;
