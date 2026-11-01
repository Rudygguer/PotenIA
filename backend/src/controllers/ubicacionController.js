const pool = require('../config/database');

// Solo ubicaciones activas, con el código y la descripción
const obtenerUbicaciones = async (req, res) => {
    try {
        const sql = 'SELECT id_ubicacion, codigo, descripcion FROM ubicacion WHERE activo = true ORDER BY codigo ASC';
        const resultado = await pool.query(sql);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener ubicaciones' });
    }
};

module.exports = { obtenerUbicaciones };