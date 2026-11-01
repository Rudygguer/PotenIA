const express = require('express');
const router = express.Router();
const { obtenerProveedores } = require('../controllers/proveedorController');

router.get('/', obtenerProveedores);

module.exports = router;