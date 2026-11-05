import { Link } from 'react-router-dom';
import '../styles/MenuAdminPage.css'; // reutilizamos los estilos del menú del admin

import BotonSalir from '../components/BotonSalir';
import BarraNavegacion from '../components/BarraNavegacion';

// Reutilizamos íconos que ya tienes (luego puedes cambiarlos por otros)
import IconoQR from '../../public/icons/Generar QR.svg?react';
import IconoReportes from '../../public/icons/Reporte de daños.svg?react';

function MenuAlmacenistaPage() {
    // Leemos al usuario que el login guardó en localStorage (viene como texto y lo pasamos a objeto)
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    // Si el usuario tiene avatar usamos ese; si no (||), uno por defecto
    const rutaAvatar = `/imagenes/avatares/${usuarioGuardado?.avatar || 'Logo_Potenia.png'}`;

    return (
        <div className="contenedor-principal-admin">
            <BotonSalir />

            {/* Tarjeta con los datos del usuario */}
            <div className="TarjetaUsuario">
                <div className="textosUsuario">
                    <p>Nombre: {usuarioGuardado?.nombre}</p>
                    <p>Rol: {usuarioGuardado?.rol}</p>
                    <p>N° Empleado: {usuarioGuardado?.numero_empleado}</p>
                </div>
                <img src={rutaAvatar} alt="Avatar del usuario" />
            </div>

            {/* Menú: un Link por cada módulo del almacenista */}
            <div className="MenuAdmin menu-tres">
                <Link to="/escanear" className="icono-grande">
                    <IconoQR className="icono-svg" />
                    <span>Escanear QR</span>
                </Link>
                <Link to="/reportar" className="icono-grande">
                    <IconoReportes className="icono-svg" />
                    <span>Reportar daño</span>
                </Link>
                <Link to="/mis-reportes" className="icono-grande">
                    <IconoReportes className="icono-svg" />
                    <span>Mis reportes</span>
                </Link>
                <Link to="/ubicacion" className="icono-grande">
                    <IconoReportes className="icono-svg" />
                    <span>Ubicación</span>
                </Link>
            </div>

            <BarraNavegacion />
        </div>
    );
}

export default MenuAlmacenistaPage;