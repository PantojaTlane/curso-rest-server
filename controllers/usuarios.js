//ESTOS SON LOS CALLBACKS DE LAS RUTAS GET, PUT, DELETE Y POST
const {response, request} = require('express');

const usuariosGet = (req = request,res = response)=>{

    const {q,nombre='No name',apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API controller',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPut = (req,res=response)=>{
    
    const {id} = req.params;

    res.json({
        msg: 'put API controller',
        id
    });
};

const usuariosPost = (req,res)=>{

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API controller',
        nombre,
        edad
    });
};

const usuariosDelete = (req,res)=>{
    res.json({
        msg: 'delete API controller'
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