const Role =  require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const { response, request } = require('express');

const estaRolEnDB = async (rol='') => {//Sera una validacion personalizada, recibe el valor mandado por post en req
    
    const existeRol = await Role.findOne({rol});//Si existe, significa que si esta guardado en la base de datos
    if(!existeRol){
        throw new Error('El rol no esta registrado en la base de datos');
    }

}

const existeCorreoDB = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});//Buscar un usuario con el correo pasado
    if(existeEmail){//Si ya existe
        /*return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        });*/
        throw new Error(`El correo ${correo} ya esta registrado`);
    }
};


//ESTO PERTENEE A LAS VALIDACIONES DEL TIPO PUT
const existeUsuarioPorID = async (id) => {
    const existeUsuaroID = await Usuario.findById(id);//Buscar un usuario con el correo pasado
    
    if(!existeUsuaroID){//Si ya existe
        /*return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        });*/
        throw new Error(`El id no existe: ${id}`);
    }
};


//ESTO PERTENCE A LAS VALIDACIONES DEL TIPO GET
const isNumerico = (req,res, next) => {

    const {limite=5, desde=0} = req.query;
    
    (req.query.limite || req.query.desde) ? 
        (isNaN(limite) || isNaN(desde)) ? 
            res.status(400).json({msg: 'Params debe ser dato númerico'})
            : next()
    : next();

};


//Get de categorias
const existeCategoria = async (id) => {
    const categoria = await Categoria.findById(id);

    if(!categoria || !categoria.estado){
        throw new Error(`El id ${id} de categoria no existe`);
    }
};


const evitarDuplicidad = async (req = request, res = response, next) => {

    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    //Obtener el id de la categoria que coincida con el nombre enviado
    const categoriaFound = await Categoria.findOne({nombre});

    if(categoriaFound){
        (id !== categoriaFound._id.toString()) ? //Si es el id diferente, entonces ya existe
            res.status(400).json({msg: 'Error, esa categoria ya existe, no duplicidad'})
        : next();
    }else{
        next();
    }

}



//Get de productos
const existeProducto = async (id) => {
    const producto = await Producto.findById(id);

    if(!producto || !producto.estado){
        throw new Error(`El id ${id} de producto no existe`);
    }
};


module.exports = {
    estaRolEnDB,
    existeCorreoDB,
    existeUsuarioPorID,
    isNumerico,
    existeCategoria,
    evitarDuplicidad,
    existeProducto
};