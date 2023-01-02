const {Schema, model} = require('mongoose');


const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true,'El nombre es obligatorio'],
        unique: true
    },
    estado: {//Para saber cuando lo estoy borrando
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {//Que usuario creo esa categoria
        type: Schema.Types.ObjectId,//Otro objeto que vamos a tener en MongoDb
        ref: 'Usuario',//Para hacer la referencia, a quin vamos a apuntar, es el nombre del modelo
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion: { type: String },
    disponible: {type:  Boolean, default: true},
    img: {type:  String}
});

ProductoSchema.methods.toJSON = function(){//Para quitar el _v
    const {__v, estado, ...data} = this.toObject();
    return data;
};

module.exports = model('Producto',ProductoSchema);