const express = require('express');
const router = express.Router();
const {
    obtenerProveedores, obtenerProveedoresResumen, crearProveedor,
    actualizarProveedor, eliminarProveedor, reactivarProveedor
} = require('../controllers/proveedorController');

// Método + dirección → función que responde.
// Todas empiezan por /api/proveedores (lo define server.js).
// El token y el permiso por rol ya los revisa server.js, aquí no hace falta nada de seguridad.
router.get('/', obtenerProveedores);                  // GET    /api/proveedores           (lista para el desplegable de productos)
router.get('/resumen', obtenerProveedoresResumen);    // GET    /api/proveedores/resumen   (lista con total de productos y stock)
router.post('/', crearProveedor);                     // POST   /api/proveedores
router.put('/reactivar/:id', reactivarProveedor);     // PUT    /api/proveedores/reactivar/5   (va ANTES de /:id)
router.put('/:id', actualizarProveedor);              // PUT    /api/proveedores/5
router.delete('/:id', eliminarProveedor);             // DELETE /api/proveedores/5

module.exports = router;