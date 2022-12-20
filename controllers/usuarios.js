//ESTOS SON LOS CALLBACKS DE LAS RUTAS GET, PUT, DELETE Y POST
const {response, request} = require('express');
const bcryptjs  = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request,res = response)=>{

    //const {q,nombre='No name',apikey, page = 1, limit} = req.query;
    const {limite=5, desde=0} = req.query;
    const query = {estado:true};//Filtrar cuyo estado sea true

    /*const usuarios = await Usuario.find(query)//Filtrar que el usuario cuyo estado sea true
        .skip(Number(desde))
        .limit(Number(limite));//limit es cuanto va a paginar o mostrar

    const total = await Usuario.countDocuments(query);*/
    
    const [total,usuarios] = await Promise.all([//Ejecutar de forma simultanea, estp para ahorrar tiempo
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);//Desectructuramos en forma de arreglo, esto porque es un arreglo jajajja

    res.json({
        total,
        usuarios
        /*total,
        usuarios*/
    });
}

const usuariosPut = async (req,res=response)=>{
    
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;//Definimos que params no tomara en cuenta

    //TODO validar contra base de datos
    if(password){//Si se quiere actualizar el body
        //Hay que encriptar la contraseña 
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto);//La funcion es: buscalo por id y actualizalo

    res.json(usuario);
};

const usuariosPost = async (req,res)=>{

    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, password, role});

    //Hay que verificar si el correo ya existe
    //Tambien hay que validar el correo, con ayuda de la libreria validator lo lograremos,npm i express-validator
    
    /*const existeEmail = await Usuario.findOne({correo});//Buscar un usuario con el correo pasado
    if(existeEmail){//Si ya existe
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        });
    }*/

    //Hay que encriptar la contraseña antes de guardarlo, hay que desacrgar un paquete. npm i bcryptjs
    const salt = bcryptjs.genSaltSync();//El numero de vueltas para hacer mas complicado la encryptacion
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en base de datos
    await usuario.save();//Guardar el registro en mongodb, guardamos los datos,

    res.json(usuario);
};

const usuariosDelete = async(req,res)=>{

    const {id} = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    //No borrarlo fisicamente sino namas cambiar el estado
    const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});

    res.json({
        usuario
    });
};

const usuariosPatch = (req,res)=>{
    res.json({
        msg: 'patch API controller'
    });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
};