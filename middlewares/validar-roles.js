const { response } = require('express');


const esAdminRole = (req, res = response, next) => {
    
    //Como tengo acceso al req.usuario puedo hacer lo siguiente

    if(!req.usuario){//Sino existe el usuario, es undefined, entonces ...
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {role, nombre} = req.usuario;
    
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede eliminar`
        });
    }

    next();
};


const tieneRole = (...roles) => {//Asi pasamos varios argumentos y no lo limitamos

    return (req, res = response, next) => {//Regresamos una funcion 
        
        if(!req.usuario){//Sino existe el usuario, es undefined, entonces ...
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }
        
        if(!roles.includes(req.usuario.role)){//Si el rol del usuario no existe en el arreglo de roles permitidos...
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }
        
        next();
    };
};


module.exports = {
    esAdminRole,
    tieneRole
};