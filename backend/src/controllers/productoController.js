// Traemos la conexión a PostgreSQL (la misma que usan los otros controladores)
const pool = require('../config/database');

// ---------- FUNCIÓN AUXILIAR ----------
// Revisa que los datos del producto sean válidos. La usan crear y actualizar.
// Devuelve un texto con el error, o null si todo está bien.
const validarProducto = async (datos) => {
    const { nombre, descripcion_producto, stock, id_proveedor, id_ubicacion } = datos;

    // Nombre y descripción son obligatorios (not null en la tabla)
    if (!nombre || !nombre.trim() || !descripcion_producto || !descripcion_producto.trim()) {
        return 'El nombre y la descripción son obligatorios';
    }

    // El stock debe ser un entero >= 0 (la tabla tiene un CHECK que lo exige)
    const stockNumero = Number(stock);
    if (!Number.isInteger(stockNumero) || stockNumero < 0) {
        return 'El stock debe ser un número entero mayor o igual a 0';
    }

    // Hay que haber elegido proveedor y ubicación en las listas
    if (!id_proveedor || !id_ubicacion) {
        return 'Debes elegir un proveedor y una ubicación';
    }

    // Comprobamos que el proveedor exista y esté activo
    const proveedor = await pool.query(
        'SELECT 1 FROM proveedores WHERE id_proveedor = $1 AND activo = true',
        [id_proveedor]
    );
    if (proveedor.rows.length === 0) {
        return 'El proveedor no existe o está desactivado';
    }

    // Lo mismo con la ubicación
    const ubicacion = await pool.query(
        'SELECT 1 FROM ubicacion WHERE id_ubicacion = $1 AND activo = true',
        [id_ubicacion]
    );
    if (ubicacion.rows.length === 0) {
        return 'La ubicación no existe o está desactivada';
    }

    return null; // null = no hay errores
};

// ---------- 1. LISTAR (R) ----------
// Une productos con proveedores y ubicación para traer nombres legibles
const obtenerProductos = async (req, res) => {
    try {
        const sqlProductos = `SELECT productos.id_producto, productos.nombre, productos.descripcion_producto,
                                     productos.stock, productos.condiciones_guardado, productos.qr_code,
                                     productos.activo, productos.id_proveedor, productos.id_ubicacion,
                                     proveedores.nombre_empresa, ubicacion.codigo
                              FROM productos
                              JOIN proveedores ON productos.id_proveedor = proveedores.id_proveedor
                              JOIN ubicacion ON productos.id_ubicacion = ubicacion.id_ubicacion
                              ORDER BY productos.nombre ASC`;
        const resultado = await pool.query(sqlProductos);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};

// ---------- 2. CREAR (C) ----------
const crearProducto = async (req, res) => {
    try {
        // Sacamos del pedido (req.body) los datos que mandó el formulario
        const { nombre, descripcion_producto, stock, condiciones_guardado, id_proveedor, id_ubicacion } = req.body;

        // Validamos; si hay error respondemos 400 (pedido mal hecho) y salimos
        const mensajeError = await validarProducto(req.body);
        if (mensajeError) {
            return res.status(400).json({ mensaje: mensajeError });
        }

        // El usuario no escribe el QR: lo generamos aquí. Date.now() da un número que no se repite.
        const qrCode = 'PROD-' + Date.now();

        // Los $1, $2... se reemplazan por el arreglo de abajo (evita inyección SQL)
        const sql = `INSERT INTO productos
                        (nombre, descripcion_producto, stock, condiciones_guardado, qr_code, id_ubicacion, id_proveedor)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     RETURNING id_producto, nombre, qr_code`;

        const nuevo = await pool.query(sql, [
            nombre.trim(),
            descripcion_producto.trim(),
            Number(stock),
            condiciones_guardado || null, // si viene vacío, guardamos null
            qrCode,
            id_ubicacion,
            id_proveedor
        ]);

        // 201 = creado
        res.status(201).json({ mensaje: 'Producto creado con éxito', producto: nuevo.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear producto' });
    }
};

// ---------- 3. EDITAR (U) ----------
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params; // el id viene en la URL: /api/productos/5
        const { nombre, descripcion_producto, stock, condiciones_guardado, id_proveedor, id_ubicacion } = req.body;

        const mensajeError = await validarProducto(req.body);
        if (mensajeError) {
            return res.status(400).json({ mensaje: mensajeError });
        }

        const sql = `UPDATE productos
                     SET nombre = $1, descripcion_producto = $2, stock = $3, condiciones_guardado = $4,
                         id_ubicacion = $5, id_proveedor = $6, fecha_actualizacion = CURRENT_TIMESTAMP
                     WHERE id_producto = $7`;

        const resultado = await pool.query(sql, [
            nombre.trim(),
            descripcion_producto.trim(),
            Number(stock),
            condiciones_guardado || null,
            id_ubicacion,
            id_proveedor,
            id
        ]);

        // rowCount = cuántas filas cambió el UPDATE. Si es 0, ese id no existe.
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar producto' });
    }
};

// ---------- 4. DESACTIVAR (D, eliminación lógica) ----------
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query(
            'UPDATE productos SET activo = false, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_producto = $1',
            [id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al desactivar producto' });
    }
};

// ---------- 5. REACTIVAR ----------
const reactivarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query(
            'UPDATE productos SET activo = true, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_producto = $1',
            [id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto reactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al reactivar producto' });
    }
};

// Publicamos las funciones para que productoRoutes.js pueda usarlas
module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    reactivarProducto
};