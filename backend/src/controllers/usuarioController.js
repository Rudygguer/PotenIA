const pool = require('../config/database');
const bcrypt = require('bcryptjs'); 

// 1. Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const query = 'SELECT id_usuario, nombre, numero_empleado, email, rol, avatar, activo FROM usuarios ORDER BY id_usuario ASC';
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

// 2. Crear un nuevo usuario
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol, avatar } = req.body;
        
        const emailExiste = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (emailExiste.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El correo ya se encuentra registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // La base de datos genera el número de empleado automáticamente, así que no lo enviamos.
        const query = `INSERT INTO usuarios (nombre, email, password, rol, avatar) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, rol, numero_empleado`;

        const nuevoUsuario = await pool.query(query, [nombre, email, passwordEncriptada, rol, avatar]);

        res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
};

// 3. Actualizar un usuario (Incluye la opción de cambiar contraseña)
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol, avatar, password } = req.body;

        // Preparamos la consulta base (sin contraseña)
        let query = `UPDATE usuarios 
                     SET nombre = $1, email = $2, rol = $3, avatar = $4 
                     WHERE id_usuario = $5 RETURNING *`;
        let valores = [nombre, email, rol, avatar, id];

        // Si el admin escribió una nueva contraseña, la encriptamos y la actualizamos
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            const passwordEncriptada = await bcrypt.hash(password, salt);
            
            query = `UPDATE usuarios 
                     SET nombre = $1, email = $2, rol = $3, avatar = $4, password = $5 
                     WHERE id_usuario = $6 RETURNING *`;
            valores = [nombre, email, rol, avatar, passwordEncriptada, id];
        }

        await pool.query(query, valores);

        res.json({ mensaje: 'Usuario actualizado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar usuario'});
    }
};

// 4. Eliminar (Desactivar) un usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE usuarios SET activo = false WHERE id_usuario = $1', [id]);
        res.json({ mensaje: 'Usuario desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
};

// 5. Reactivar un usuario
const reactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE usuarios SET activo = true WHERE id_usuario = $1', [id]);
        res.json({ mensaje: 'Usuario reactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al reactivar usuario' });
    }
};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    reactivarUsuario
};