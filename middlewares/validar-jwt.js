const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    
    const token = req.header('x-token');//Leemos el header x-token que contendra el token generado
    
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY );//Verificamos el token, 
                                                           //los parametros son el token, la firma (public key)
                                                           //para despues obtener el uid del usuario que inicaia sesion
    

        //Leer el usuario que corresponda al uid del que inicio sesion y que este disponible en el controlador
        //usuarios.js en la parte de usuariosDelete
        const usuario = await Usuario.findById(uid);

        //Si el usuario no existe
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en db'
            });
        }

        //Si el usuario que ha iniciado sesion no ha sido borrado o no esta borrado..entonces
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario ya esta elimiando con estado false'
            });
        }

        req.usuario = usuario; //Ese uid lo hacemos disponible para el controlador usuariosDelete

        next();   
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });   
    }

};


module.exports = {
    validarJWT
};