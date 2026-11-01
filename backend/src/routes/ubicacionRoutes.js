const express = require('express');
const router = express.Router();
const { obtenerUbicaciones } = require('../controllers/ubicacionController');

router.get('/', obtenerUbicaciones);

module.exports = router;