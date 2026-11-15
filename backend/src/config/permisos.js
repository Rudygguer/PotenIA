// Qué puede hacer cada rol en cada módulo de la API.
// Para agregar un módulo o cambiar un permiso, solo se edita este archivo.
const TODOS = ['GET', 'POST', 'PUT', 'DELETE'];

const permisos = {
    usuarios:    { admin: TODOS },
    productos:   { admin: TODOS, almacenista: ['GET'] },
    proveedores: { admin: TODOS, almacenista: ['GET'] },
    ubicaciones: { admin: TODOS, almacenista: ['GET'] }
};

module.exports = permisos;