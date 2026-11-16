// Traemos la conexión a PostgreSQL (la misma que usan los otros controladores)
const pool = require('../config/database');

// ---------- DATOS FIJOS ----------
// Íconos permitidos para un proveedor (son archivos de frontend/public/imagenes/proveedores/).
// Validamos contra esta lista para que nadie guarde un nombre de archivo cualquiera.
const AVATARES_VALIDOS = [
    'proveedor_caja.svg', 'proveedor_camion.svg', 'proveedor_fabrica.svg', 'proveedor_bodega.svg',
    'proveedor_tienda.svg', 'proveedor_contenedor.svg', 'proveedor_etiqueta.svg', 'proveedor_globo.svg'
];
const AVATAR_POR_DEFECTO = 'proveedor_caja.svg';

// ---------- 0. LISTA PARA EL DESPLEGABLE DE PRODUCTOS (YA EXISTÍA, NO SE CAMBIA) ----------
// Solo proveedores ACTIVOS y solo las columnas que necesita la lista desplegable
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

// ---------- FUNCIÓN AUXILIAR: VALIDAR ----------
// La usan crear y actualizar. Devuelve un texto con el error, o null si todo está bien.
// idActual es el id del proveedor que se está editando (null si se está creando).
const validarProveedor = async (datos, idActual = null) => {
    const { nombre_empresa, telefono, email, direccion, avatar } = datos;

    // Estos cuatro son "not null" en la tabla, así que son obligatorios
    if (!nombre_empresa || !nombre_empresa.trim() || !telefono || !telefono.trim() ||
        !email || !email.trim() || !direccion || !direccion.trim()) {
        return 'Nombre de la empresa, teléfono, correo y dirección son obligatorios';
    }

    // Formato básico de correo: algo, una @, algo, un punto, algo
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!correoValido) {
        return 'El correo no tiene un formato válido';
    }

    // Si mandaron avatar, tiene que ser uno de la lista
    if (avatar && !AVATARES_VALIDOS.includes(avatar)) {
        return 'El ícono elegido no es válido';
    }

    // No repetir el nombre de la empresa (sin importar mayúsculas).
    // "id_proveedor <> $2" excluye al propio proveedor cuando se edita.
    // Al crear no hay id, así que mandamos 0 (ningún proveedor real tiene id 0).
    const repetido = await pool.query(
        'SELECT 1 FROM proveedores WHERE LOWER(nombre_empresa) = LOWER($1) AND id_proveedor <> $2',
        [nombre_empresa.trim(), idActual || 0]
    );
    if (repetido.rows.length > 0) {
        return 'Ya existe un proveedor con ese nombre';
    }

    return null; // null = no hay errores
};

// ---------- 1. LISTAR CON RESUMEN (R) ----------
// Por cada proveedor cuenta sus productos activos y suma su stock.
// LEFT JOIN: así también aparecen los proveedores que todavía no tienen productos.
// ::int convierte el resultado a número (sin eso, pg lo devuelve como texto).
const obtenerProveedoresResumen = async (req, res) => {
    try {
        const sql = `SELECT pr.id_proveedor, pr.nombre_empresa, pr.persona_contacto, pr.telefono,
                            pr.email, pr.direccion, pr.avatar, pr.activo,
                            COUNT(p.id_producto)::int       AS total_productos,
                            COALESCE(SUM(p.stock), 0)::int  AS stock_total
                     FROM proveedores pr
                     LEFT JOIN productos p
                            ON p.id_proveedor = pr.id_proveedor AND p.activo = true
                     GROUP BY pr.id_proveedor
                     ORDER BY pr.nombre_empresa ASC`;
        const resultado = await pool.query(sql);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener proveedores' });
    }
};

// ---------- 2. CREAR (C) ----------
const crearProveedor = async (req, res) => {
    try {
        const { nombre_empresa, persona_contacto, telefono, email, direccion, avatar } = req.body;

        const mensajeError = await validarProveedor(req.body);
        if (mensajeError) {
            return res.status(400).json({ mensaje: mensajeError });
        }

        const sql = `INSERT INTO proveedores (nombre_empresa, persona_contacto, telefono, email, direccion, avatar)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING id_proveedor, nombre_empresa`;

        const nuevo = await pool.query(sql, [
            nombre_empresa.trim(),
            persona_contacto ? persona_contacto.trim() : null, // opcional: si viene vacío, null
            telefono.trim(),
            email.trim().toLowerCase(),                         // el correo siempre en minúsculas
            direccion.trim(),
            avatar || AVATAR_POR_DEFECTO                        // si no eligió ícono, el de por defecto
        ]);

        res.status(201).json({ mensaje: 'Proveedor creado con éxito', proveedor: nuevo.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear proveedor' });
    }
};

// ---------- 3. EDITAR (U) ----------
const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params; // el id viene en la URL: /api/proveedores/5
        const { nombre_empresa, persona_contacto, telefono, email, direccion, avatar } = req.body;

        const mensajeError = await validarProveedor(req.body, id);
        if (mensajeError) {
            return res.status(400).json({ mensaje: mensajeError });
        }

        const sql = `UPDATE proveedores
                     SET nombre_empresa = $1, persona_contacto = $2, telefono = $3,
                         email = $4, direccion = $5, avatar = $6
                     WHERE id_proveedor = $7`;

        const resultado = await pool.query(sql, [
            nombre_empresa.trim(),
            persona_contacto ? persona_contacto.trim() : null,
            telefono.trim(),
            email.trim().toLowerCase(),
            direccion.trim(),
            avatar || AVATAR_POR_DEFECTO,
            id
        ]);

        // rowCount = cuántas filas cambió el UPDATE. Si es 0, ese id no existe.
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }

        res.json({ mensaje: 'Proveedor actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar proveedor' });
    }
};

// ---------- 4. DESACTIVAR (D, eliminación lógica) ----------
// REGLA B: no se puede desactivar un proveedor que tiene productos ACTIVOS con stock mayor que 0.
const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        // Sumamos el stock de los productos activos de este proveedor
        const stock = await pool.query(
            'SELECT COALESCE(SUM(stock), 0)::int AS stock_total FROM productos WHERE id_proveedor = $1 AND activo = true',
            [id]
        );

        if (stock.rows[0].stock_total > 0) {
            return res.status(400).json({
                mensaje: `No se puede desactivar: el proveedor tiene ${stock.rows[0].stock_total} unidades en stock en productos activos`
            });
        }

        const resultado = await pool.query(
            'UPDATE proveedores SET activo = false WHERE id_proveedor = $1',
            [id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }
        res.json({ mensaje: 'Proveedor desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al desactivar proveedor' });
    }
};

// ---------- 5. REACTIVAR ----------
const reactivarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query(
            'UPDATE proveedores SET activo = true WHERE id_proveedor = $1',
            [id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }
        res.json({ mensaje: 'Proveedor reactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al reactivar proveedor' });
    }
};

// Publicamos las funciones para que proveedorRoutes.js pueda usarlas
module.exports = {
    obtenerProveedores,
    obtenerProveedoresResumen,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    reactivarProveedor
};
