// 1. Importamos la librería 'pg' (PostgreSQL) que instalamos con npm
const { Pool } = require('pg');
// 2. Importamos dotenv para leer las variables secretas del archivo .env
require('dotenv').config();

// 3. Creamos un "Pool" de conexiones. 
// Un Pool es como un grupo de tuberías; en lugar de abrir y cerrar una tubería por cada consulta, las reutiliza (es más rápido).
const pool = new Pool({
    host: process.env.DB_HOST,         // Lee 'localhost' del .env
    port: process.env.DB_PORT,         // Lee '5432' del .env
    user: process.env.DB_USER,         // Lee 'postgres' del .env
    password: process.env.DB_PASSWORD, // Lee tu contraseña del .env
    database: process.env.DB_NAME      // Lee 'potenia_db' del .env
});

// 4. Hacemos una prueba de conexión al iniciar
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error al conectar a PostgreSQL:', err.message);
    }
    console.log('✅ Conectado a PostgreSQL exitosamente');
    release(); // Cerramos esta conexión de prueba
});

// 5. Exportamos 'pool' para poder usarlo en nuestros controladores (como el de login)
module.exports = pool;