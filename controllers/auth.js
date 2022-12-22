const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {

        //Veirificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos: correo no esta'
            });
        }

        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos: estado false'
            });
        }
        
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if( !validPassword ){//Sino coincide
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos: password incorrecto'
            });
        }

        //Generar el JWT, para ello usamos su respectiva libreria, npm i jsonwebtoken
        const token = await generarJWT(usuario.id);//Esta funcion la vamos a crear, esta en la carpeta helpers


        res.json({
            usuario,
            token
        }); 

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });

    }

};


module.exports = {
    login
};