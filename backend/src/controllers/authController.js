const pool = require('../config/database'); // Traemos la conexión a PostgreSQL
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
// Función para el Login
const login = async (req, res) => {
    try {
        // 1. Recibimos los datos que envía React (req.body)
        const { numero_empleado, password } = req.body;

        // 2. Hacemos la consulta a PostgreSQL (SQL)
        // El $1 significa "reemplaza esto por el primer dato que te di", evita hackeos.
        const query = 'SELECT * FROM usuarios WHERE numero_empleado = $1';
        const resultado = await pool.query(query, [numero_empleado]);

        // 3. Verificamos si el usuario existe
        if (resultado.rows.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuarioDB = resultado.rows[0];

        // 4. Verificamos si el usuario está activo
        if (!usuarioDB.activo) {
            // 403 significa "Prohibido" (el usuario existe, pero no tiene permiso)
            return res.status(403).json({ mensaje: 'Tu usuario está desactivado. Por favor, contacta al administrador.' });
        }

        // 5. Verificamos la contraseña usando bcrypt (compara el texto plano con el hash encriptado)
        const passwordValida = await bcrypt.compare(password, usuarioDB.password);
        
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // 5.1 Creamos el token con los datos que el backend necesitará después
        const token = jsonwebtoken.sign(
            { id: usuarioDB.id_usuario, rol: usuarioDB.rol }, // 1. qué guarda el token
                process.env.JWT_SECRET,                            // 2. con qué clave se firma
                    { expiresIn: '1h' }                                // 3. cuánto dura
);

        // 6. Si todo está bien, respondemos con éxito
        res.json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                id: usuarioDB.id_usuario,
                nombre: usuarioDB.nombre,
                numero_empleado: usuarioDB.numero_empleado,
                rol: usuarioDB.rol,
                avatar: usuarioDB.avatar 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

module.exports = { login };