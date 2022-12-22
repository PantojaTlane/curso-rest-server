const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) =>{ //Se recibe el identificador unico del usuario

    //Como el paquete de jsonwebtoken trabaja con promesas, trabajaremos con ellas
    return new Promise( (resolve, reject) => {

        //El uid seria el payload de mi json web token
        const payload = { uid };

        jwt.sign( payload,  process.env.SECRETORPRIVATEKEY, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        });//Los parametros son el payload, la firma(esta en .env) y otras configuraciones cerradas entre {}
           //las cuales puedo definir cuando expira y el callback

    });

}

module.exports = {
    generarJWT
}