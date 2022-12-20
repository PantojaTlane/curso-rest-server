const {Router} = require('express');
const {check} = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const { estaRolEnDB, existeCorreoDB, existeUsuarioPorID, isNumerico } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/',[
    isNumerico
],usuariosGet);

router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    check('role').custom(estaRolEnDB),
    validarCampos
],usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe ser mas de 6 letras').isLength({min:6}),
    check('correo','El correo no es valido').isEmail(),
    check('role').custom(estaRolEnDB),
    check('correo').custom(existeCorreoDB),
    //check('role','No es un role permitido').isIn(['ADMIN_ROLE','USER_ROLE']),//isIn es para ver si esta en un arreglo
    validarCampos//Si pasa next(), entonces se va al controlador usuariosPost 
],usuariosPost);//Validar correo, para eso se pasa un middleware como segundo argumento
//Los errores de los middlewares se van preparando para ser pasados ya sea en el
//request o response del tercer argumento, en este caso usuariosPosts para despues capturlos en el controlador

router.delete('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos
],usuariosDelete);

router.patch('/',usuariosPatch);

module.exports = router;