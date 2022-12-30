const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria, isNumerico, evitarDuplicidad } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Obtner todas las categorias
router.get('/', [isNumerico], obtenerCategorias);


//Obtner una categoria en particular
router.get('/:id', [//AQUI ME QUEDE, VALIDANDO EL ID
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),//Verificar si existe la categoria, se parece a db-validators
    validarCampos
], obtenerCategoria);


//Crear una nueva categoria - privado - lo puede crear cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


//Actualizar, mandando un id en particular, cualquiera puede hacerlo con un token valido
router.put('/:id', [
    validarJWT,
    check('id','No es un ID correcto').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    evitarDuplicidad,
    validarCampos
], actualizarCategoria);


//Solamente el administrador puede borrar la categoria
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos    
], borrarCategoria);


module.exports = router;