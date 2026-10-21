// 1. Importamos las librerías necesarias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 2. Importamos nuestro archivo de base de datos y las rutas
const pool = require('./src/config/database'); 
const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');

// 3. Inicializamos Express (crea la aplicación)
const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto del .env o el 3000 por defecto

// 4. MIDDLEWARES (Filtros que procesan las peticiones antes de llegar a las rutas)
app.use(cors()); // Permite que React (en el puerto 5173) se comunique con Node (en el 3000)
app.use(express.json()); // Permite que Node entienda los datos en formato JSON que envía React

// 5. RUTAS (Las puertas de entrada a nuestra API)
// Le decimos: "Cualquier petición que empiece con /api/auth, mándala a authRoutes"
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Ruta de prueba para ver si el servidor está vivo
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API de PotenIA funcionando' });
});

// 6. Encendemos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});