const {Router} = require('express');
const {check} = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas, archivoEnviado } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//Se va a crear archivos, ya sea un excel, un csv etcetera
router.post('/', cargarArchivo);

router.put('/:coleccion/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios','productos'])),
    archivoEnviado,
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
],mostrarImagen);

module.exports = router;