const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Definimos la ruta POST /api/auth/login y le asignamos la función de arriba
router.post('/login', login);

module.exports = router;