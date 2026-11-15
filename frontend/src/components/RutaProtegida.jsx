import { Navigate, Outlet } from 'react-router-dom';

function RutaProtegida({ rolPermitido }) {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // 1. Sin sesión: al login
    if (!token || !usuario) {
        return <Navigate to="/login" replace />;
    }

    // 2. Con sesión pero rol equivocado: a SU menú
    if (usuario.rol !== rolPermitido) {
        return <Navigate to={usuario.rol === 'admin' ? '/admin' : '/almacenista'} replace />;
    }

    // 3. Todo bien: se muestra la página que corresponde
    return <Outlet />;
}

export default RutaProtegida;