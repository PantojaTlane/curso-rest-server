//Crear un formato de como queremos que se vea la informacion en nuestra base de datos
//Objetos son como registros, son documentos,
//Los documentos estan en colecciones, parecido a las tablas

/*{
    nombre: '',
    correo: '',
    password: '',
    img: '',
    rol: '',
    estado: false,//Si el usuario esta conectado o no
    google: true//Si el usuario fue creado por Google o no
}*/

const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({//Definir la estructura de los datos
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']//El true es para decir que si se requiere, y se tiene el mensaje en caso de que no se haya enviado
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true//Evitar correos duplicados
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE']//Definir el tipo de rol
    },
    estado: {
        type: Boolean,
        default: true//Cuando yo cree un usuario, por defecto estará activado
    },
    google: {//Si el usuario se creo por Google
        type: Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function(){//Para quitar el password y _v
    const {__v, password, _id, ...usuario} = this.toObject();//Quitamos el __v y password pero mantenemos las demas propiedadse
    usuario.uid = _id; //Cambiamos la propiedad _id por uid
    return usuario;
};

module.exports = model('Usuario', UsuarioSchema);//Exportamos la estrcutura del modelo, es decir, nombre de la coleccion(tabla) y su estructura Schema