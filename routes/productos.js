const {Router} = require('express');
const {check} = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Obtner todos los productos
router.get('/', obtenerProductos);


//Obtner un producto en particular
router.get('/:id', [//AQUI ME QUEDE, VALIDANDO EL ID
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),//Verificar si existe la categoria, se parece a db-validators
    validarCampos
], obtenerProducto);


//Crear un nuevo producto - privado - lo puede crear cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);


//Actualizar, mandando un id en particular, cualquiera puede hacerlo con un token valido
router.put('/:id', [
    validarJWT,
    check('id','No es un ID correcto').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);


//Solamente el administrador puede borrar el producto
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos    
], borrarProducto);


module.exports = router;