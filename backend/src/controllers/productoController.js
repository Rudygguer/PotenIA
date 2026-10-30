const pool = require('../config/database');



// se obtiene la lista de los productos, proveeodres y la ubicación. 
const obtenerProductos = async (req, res) => {
    try {const sqlProductos = `SELECT productos.id_producto, productos.nombre, productos.stock, proveedores.nombre_empresa, ubicacion.codigo 
                            FROM productos JOIN proveedores ON productos.id_proveedor = proveedores.id_proveedor 
                            JOIN ubicacion ON productos.id_ubicacion = ubicacion.id_ubicacion 
                            ORDER BY productos.nombre ASC`;
        const resultado = await pool.query(sqlProductos);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};






module.exports = {
    obtenerProductos
};