const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
//configurar el usuario que esta utilizando el servicio
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");

const cargarArchivo = async (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: 'No hay archivos para subir'});
        return;
    }

    try {
        //const nombre = await subirArchivo(req.files,['txt','md'],'textos');
        const nombre = await subirArchivo(req.files,undefined,'imgs');
        res.json({nombre});   
    } catch (msg) {
        res.status(400).json({msg});
    }
    
};


const actualizarImagen = async (req, res = response)=> {
    const {id, coleccion} = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            //Verificar si existe el id
            modelo = await Usuario.findById(id);

            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            }
        break;

        case 'productos':
            //Verificar si existe el id
            modelo = await Producto.findById(id);

            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }


    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);

        //Verificar si existe
        if(fs.existsSync(pathImagen)){//Si existe esa ruta o directorio
            fs.unlinkSync(pathImagen);//Lo borramos la imagen
        }
    }


    const nombre = await subirArchivo(req.files,undefined,coleccion);//El tercer parametro es por la coleccion
    modelo.img = nombre;//Nombre del archivo

    await modelo.save();

    res.json(modelo);
};








const actualizarImagenCloudinary = async (req, res = response)=> {
    const {id, coleccion} = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            //Verificar si existe el id
            modelo = await Usuario.findById(id);

            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            }
        break;

        case 'productos':
            //Verificar si existe el id
            modelo = await Producto.findById(id);

            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }


    //Limpiar imagenes previas
    if(modelo.img){
        //Hay que borrar la imagen del servidor
        /*const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);

        //Verificar si existe
        if(fs.existsSync(pathImagen)){//Si existe esa ruta o directorio
            fs.unlinkSync(pathImagen);//Lo borramos la imagen
        }*/

        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    
    //const nombre = await subirArchivo(req.files,undefined,coleccion);//El tercer parametro es por la coleccion
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);//Regresa una promesa y obtenemos el url de la imagen

    //modelo.img = nombre;//Nombre del archivo
    modelo.img = secure_url;

    await modelo.save();
    //res.json(nombre);

    res.json(modelo);
};









const mostrarImagen = async (req, res = response) => {
    const {id, coleccion} = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            //Verificar si existe el id
            modelo = await Usuario.findById(id);

            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            }
        break;

        case 'productos':
            //Verificar si existe el id
            modelo = await Producto.findById(id);

            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }


    //Mostrar la imagen si existe la propiedad img en el usuario
    if(modelo.img){
        //Crear la ruta de la imagen
        const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);

        //Verificar si existe
        if(fs.existsSync(pathImagen)){//Si existe esa ruta o directorio
            return res.sendFile(pathImagen);//Para mostrar o enviar un archivo
        }
    }

    const pathImageDefault = path.join(__dirname, '../assets/no-image.jpg');

    //res.json({msg: 'falta placeholder'});
    res.sendFile(pathImageDefault);
};


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
};