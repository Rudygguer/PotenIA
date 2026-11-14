const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, reactivarUsuario } = require('../controllers/usuarioController');
const { verificarToken } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.put('/reactivar/:id', reactivarUsuario);

module.exports = router;