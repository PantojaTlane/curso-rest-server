const { response } = require("express");
const  { isValidObjectId } = require('mongoose');

const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async (termino = '', res  = response) => {
    const esMongoID = isValidObjectId(termino);//Retorna true si es valido el id 

    if(esMongoID){
        const usuario = await Usuario.findById(termino); 
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    //Hacer busqueedas insensibles, que me traiga todos los usuarios que coincida con el que se solicita
    const regex = new RegExp(termino, 'i');//que sea insensible a las mayusculas y minusculas
    const usuarios = await Usuario.find({// que encuentre ya sea por nombre o por correo
        $or: [{nombre: regex}, {correo: regex}],//Y que sea true, que no este eliminado
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    });
};


const buscarCategorias = async (termino = '', res  = response) => {
    const esMongoID = isValidObjectId(termino);//Retorna true si es valido el id 

    if(esMongoID){
        const categoria = await Categoria.findById(termino); 
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    //Hacer busqueedas insensibles, que me traiga todos las categorias que coincida con el que se solicita
    const regex = new RegExp(termino, 'i');//que sea insensible a las mayusculas y minusculas
    const categorias = await Categoria.find({// que encuentre ya sea por nombre o por correo
        $or: [{nombre: regex}],//Y que sea true, que no este eliminado
        $and: [{estado: true}]
    });

    res.json({
        results: categorias
    });
};




const buscarProductos = async (termino = '', res  = response) => {
    const esMongoID = isValidObjectId(termino);//Retorna true si es valido el id 

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('usuario').populate('categoria'); 
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    //Hacer busqueedas insensibles, que me traiga todos los productos que coincida con el que se solicita
    const regex = new RegExp(termino, 'i');//que sea insensible a las mayusculas y minusculas
    const productos = await Producto.find({// que encuentre ya sea por nombre o por correo
        $or: [{nombre: regex}],//Y que sea true, que no este eliminado
        $and: [{estado: true}]
    }).populate('usuario').populate('categoria');

    res.json({
        results: productos
    });
};




const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){//Si no esta en ese arreglo ... 
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;
        
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            });
    }
};


module.exports = {
    buscar
}