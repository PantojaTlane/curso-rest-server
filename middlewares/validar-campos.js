const { validationResult } = require('express-validator');

const validarCampos = (req,res, next)=>{
    
    //Capturando los errores de los middlewares, si es que hay
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();//Decimos que vaya al siguiente middleware, si no hay, que vaya al controlador

};

module.exports = {
    validarCampos
};