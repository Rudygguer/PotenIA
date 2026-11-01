const express = require('express');
const router = express.Router();
const {
    obtenerProductos, crearProducto, actualizarProducto, eliminarProducto, reactivarProducto
} = require('../controllers/productoController');

// Método + dirección → función que responde.
// Todas empiezan por /api/productos (lo define server.js)
router.get('/', obtenerProductos);                    // GET    /api/productos
router.post('/', crearProducto);                      // POST   /api/productos
router.put('/reactivar/:id', reactivarProducto);      // PUT    /api/productos/reactivar/5
router.put('/:id', actualizarProducto);              // PUT    /api/productos/5
router.delete('/:id', eliminarProducto);              // DELETE /api/productos/5

module.exports = router;