const { response, json } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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


const googleSignIn = async (req, res = response) => {
    
    //Aqui recibimos el token de google unav ez iniciado sesion, hay que procesarlo
    //Asi que instalamos un pauqte con la siguiente linea: npm install google-auth-library --save
    //Creamos un archivo en la carpeta de helpers, para el codigo que nos ofrece la documentacion
    const  {id_token} = req.body;

    try {
        
        const {nombre, img, correo} = await googleVerify(id_token);

        //Verificar si ya existe ese correo en la base de datos
        let usuario = await Usuario.findOne({correo});
        //Si no existe el usuario, entonces lo creamos
        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                role: 'USER_ROLE',
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        //Si el usuario en DB, es borrado, es decir, su estado es falso
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }


        //Una vez pase esas condiciones, obtenemos o generamos su Json Web Token
        const token = await generarJWT(usuario.id);

        return res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg : 'El token no se pudo verificar'
        });
    }

};

module.exports = {
    login,
    googleSignIn
};