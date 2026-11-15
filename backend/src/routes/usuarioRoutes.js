const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, reactivarUsuario } = require('../controllers/usuarioController');
const { verificarToken, soloAdmin } = require('../middleware/authMiddleware');


router.use(verificarToken, soloAdmin);
router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.put('/reactivar/:id', reactivarUsuario);

module.exports = router;