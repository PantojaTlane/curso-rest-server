const path = require('path');//Util para manejar rutas o directorios

const { v4: uuidv4 } = require('uuid');

//Puedo pasar como parametro 'carpeta' para definir donde lo voy a guardar
const subirArchivo = (files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '') => {

    return new Promise((resolve,reject) => {

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');//El split permite cortar el string

        const extension = nombreCortado[nombreCortado.length - 1];//Permite acceder al ultimo elemento y asi obtener la extension
        
        //Validar todas las extensiones, crear un arreglo de las extensiones permitidas, estan como parametros

        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;//Renombramos el archivo
        
        //Subir un archivo a una ruta
        const uploadPath = path.join (__dirname, '../uploads/', carpeta ,nombreTemp);//Donde lo va a subir

        archivo.mv(uploadPath, err => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });

    });

};

module.exports = {
    subirArchivo
};