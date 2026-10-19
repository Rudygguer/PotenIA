import { Link, useNavigate } from 'react-router-dom';
import '../styles/MenuAdminPage.css'; 

function MenuAdminPage() {
    const navigate = useNavigate();
    
    // Recuperamos los datos del usuario que guardamos en el Login
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('usuario'); 
        navigate('/login'); 
    };

    return (
        <div>
            {/* Botón de salir arriba a la derecha */}
            <div className="salida" id="boton_salida">
                <button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--azul)', fontWeight: 'bold'}}>
                    Cerrar Sesión
                </button>
            </div>

            {/* Tarjeta del Usuario */}
            <div className="TarjetaUsuario" id="T_usuario">
                <div className="textosUsuario">
                    <h5>Nombre: {usuarioGuardado?.nombre || 'Admin'}</h5>
                    <h5>Rol: {usuarioGuardado?.rol || 'admin'}</h5>
                    <h5>ID: {usuarioGuardado?.id || '000'}</h5>
                </div>
                <img src="/imagenes/Usuario.png" alt="Usuario Admin" />
            </div>

            {/* Menú de Opciones */}
            <div className="MenuAdmin" id="M_admin">
                <Link to="/usuarios" className="icono-grande">
                    {/* <img src="/icons/Gestion de usuarios.svg" alt="Usuarios" /> */}
                    <span>Gestión de usuarios</span>
                </Link>
                <Link to="/productos" className="icono-grande">
                    {/* <img src="/icons/Gestion de productos.svg" alt="Productos" /> */}
                    <span>Gestión de productos</span>
                </Link>
                <Link to="/dashboard" className="icono-grande">
                    <span>Dashboard de métricas</span>
                </Link>
                <Link to="/qr" className="icono-grande">
                    <span>Generar QR</span>
                </Link>
                <Link to="/reportes" className="icono-grande">
                    <span>Reportes de daños</span>
                </Link>
                <Link to="/ia" className="icono-grande">
                    <span>Generar informe IA</span>
                </Link>
            </div>
        </div>
    );
}

export default MenuAdminPage;