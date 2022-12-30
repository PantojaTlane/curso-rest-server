const { response, request, json } = require("express");
const Categoria = require("../models/categoria");


//Crear controladores

//obtenerCategorias - paginado, mostrar las categorias - mostrar el total - usar el metodo de mongoose 'populate' para mostrar la relacion, es decir, el usuario que lo creo
const obtenerCategorias = async (req = request, res = response) => {
    const {desde = 0, limite = 5} = req.query;
    const query = {estado: true};

    const total = await Categoria.countDocuments(query);

    const categorias = await Categoria
        .find(query)
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        total,
        categorias
    });
};



//obtenerCategoria - usar el populate(), regresar el pbjeto de la categoria
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json({
        categoria
    });
};


const crearCategoria = async (req,res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    //Revisar si ya existe una categoria que se quiere crear otravez
    const categoriaDB = await Categoria.findOne({nombre});
    
    if(categoriaDB && categoriaDB.estado){
        return res.status(400).json({
            msg: `La categoria ${nombre}, ya existe`
        });
    }

    if(categoriaDB && !categoriaDB.estado){
        const {id} = categoriaDB;

        const data = {
            estado: true,
            usuario: req.usuario._id
        };

        const cat = await Categoria.findByIdAndUpdate(id, data);

        return res.json({
            cat
        });
    }

    //Generar la data a guardar, hay que excluir el estado, esto por si me lo mandan por el front end
    const data = {
        nombre,
        usuario: req.usuario._id //Obtener el id del usuario que inicia sesion
    };

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();   
    res.status(200).json(categoria);
    

};


//actualizarCategoria - cambiar de nombre
const actualizarCategoria = async (req = request, res = response) => {
    const {estado, usuario, ...data } = req.body;
    const { id } = req.params;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data);

    res.json({
        categoria
    });
};

//borrarCategoria - es solo cambiar el estado a false
const borrarCategoria = async (req, res) => {
    const {id} = req.params;

    //No borrarlo fisicamente sino namas cambiar el estado
    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false});

    res.json({
        categoria
    });
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
};