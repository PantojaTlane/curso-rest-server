const { response, request, json } = require("express");
const categoria = require("../models/categoria");
const Producto = require("../models/producto");


//Crear controladores

//obtenerProductos - paginado, mostrar las categorias - mostrar el total - usar el metodo de mongoose 'populate' para mostrar la relacion, es decir, el usuario que lo creo
const obtenerProductos = async (req = request, res = response) => {
    const {desde = 0, limite = 5} = req.query;
    const query = {estado: true};

    const total = await Producto.countDocuments(query);

    const productos = await Producto
        .find(query)
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        total,
        productos
    });
};



//obtenerProducto - usar el populate(), regresar el pbjeto de la categoria
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
                                    .populate('usuario','nombre')
                                    .populate('categoria','nombre');

    res.json({
        producto
    });
};


const crearProducto = async (req,res = response) => {
    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    };

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);
};


//actualizarCategoria - cambiar de nombre
const actualizarProducto = async (req = request, res = response) => {
    const {estado, usuario, ...data } = req.body;
    const { id } = req.params;
    
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data);

    res.json({
        producto
    });
};

//borrarCategoria - es solo cambiar el estado a false
const borrarProducto = async (req, res) => {
    const {id} = req.params;

    //No borrarlo fisicamente sino namas cambiar el estado
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado: false});

    res.json(productoBorrado);
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
};