const pool = require('../config/database');

// Solo trae los proveedores ACTIVOS y solo las columnas que necesita la lista desplegable
const obtenerProveedores = async (req, res) => {
    try {
        const sql = 'SELECT id_proveedor, nombre_empresa FROM proveedores WHERE activo = true ORDER BY nombre_empresa ASC';
        const resultado = await pool.query(sql);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener proveedores' });
    }
};

module.exports = { obtenerProveedores };