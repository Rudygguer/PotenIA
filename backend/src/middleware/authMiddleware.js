const jsonwebtoken = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Leemos el encabezado que manda el cliente
    const encabezado = req.headers.authorization;

    // 2. Si no mandó nada, no sabemos quién es
    if (!encabezado) {
        return res.status(401).json({ mensaje: 'Acceso denegado: falta el token' });
    }

    // 3. El encabezado llega como "Bearer abc123...". Nos quedamos con la segunda parte
    const token = encabezado.split(' ')[1];

    try {
        // 4. Verificamos la firma y la fecha. Si algo está mal, lanza un error
        const datos = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // 5. Guardamos los datos del token para que los usen las funciones siguientes
        req.usuario = datos;

        // 6. Dejamos que la petición continúe
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o vencido' });
    }
};

module.exports = { verificarToken };