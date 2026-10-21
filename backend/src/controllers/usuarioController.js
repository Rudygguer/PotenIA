const pool = require('../config/database');
const bcrypt = require('bcryptjs'); 

// con esta función se obtienen los usuarios o muestra error cuando no puede.
const obtenerUsuarios = async (req, res) => {
    try {
        const query = 'SELECT id_usuario, nombre, numero_empleado, email, rol, avatar, activo FROM usuarios ORDER BY id_usuario ASC';
        const resultado = await pool.query(query);
            console.log("Usuarios encontrados en BD:", resultado.rows.length);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({mensaje: 'Error al obtener usuarios'});
    }
};

// esta es la función para crear un nuevo usuario (POST)
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol, avatar} = req.body;
        
        const emailExiste = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (emailExiste.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El usuario ya se encuentra registrado'});
        }

        // esto es para encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // aqui se guarda en la DB 
        const query = `INSERT INTO usuarios (nombre, email, password, rol, avatar) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, rol, numero_empleado`;

        const nuevoUsuario = await pool.query(query, [nombre, email, passwordEncriptada, rol, avatar]);
        // retorna el status 201 creado con exito 
        res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({mensaje: 'Error al crear usuario'});
    }
};

// Funcion para actualizar un usuario (PUT)
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol, avatar} = req.body;

        const query = `UPDATE usuarios 
                       SET nombre = $1, email = $2, rol = $3, avatar = $4 
                       WHERE id_usuario = $5 RETURNING *`;

        await pool.query(query, [nombre, email, rol, avatar, id]);

        res.json({ mensaje: 'Usuario actualizado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar usuario'});
    }
}; 

// Funcion para eliminar usuarios, eliminacion logica
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query ('UPDATE usuarios SET activo = false WHERE id_usuario = $1', [id]);
        res.json ({ mensaje: 'Usuario desactivado correctamente'});
    } catch (error) { 
        console.error(error);
        res.status(500).json ({ mensaje: 'Error al eliminar usuario'});
    }
};

// Funcion para reactivar un usuario
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

// se exportan las funciones para que las rutas puedan usarlas.
module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    reactivarUsuario
};