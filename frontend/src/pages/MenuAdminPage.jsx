import { Link } from 'react-router-dom';
import '../styles/MenuAdminPage.css'; 

// Importamos nuestros componentes reutilizables
import BotonSalir from '../components/BotonSalir';
import BarraNavegacion from '../components/BarraNavegacion'; 

// Importamos los íconos del menú
import IconoUsuarios from '../../public/icons/Gestion de usuarios.svg?react';
import IconoProductos from '../../public/icons/Gestion de productos.svg?react';
import IconoDashboard from '../../public/icons/Dashboard metricas.svg?react';
import IconoQR from '../../public/icons/Generar QR.svg?react';
import IconoReportes from '../../public/icons/Reporte de daños.svg?react';
import IconoIA from '../../public/icons/Generar informe IA.svg?react';

function MenuAdminPage() {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    const obtenerAvatar = (rol) => {
        if (rol === 'admin') {
            return '/imagenes/avatares/admin_hombre.jpeg';
        } else {
            return '/imagenes/avatares/almacenista_hombre.jpeg';
        }
    };

    return (
        <div className="contenedor-principal-admin">
            
            {/* 👈 Botón de salir reutilizable */}
            <BotonSalir />

            <div className="TarjetaUsuario" id="T_usuario">
                <div className="textosUsuario">
                    <p>Nombre: {usuarioGuardado?.nombre || 'Admin'}</p>
                    <p>Rol: {usuarioGuardado?.rol || 'admin'}</p>
                    <p>N° Empleado: {usuarioGuardado?.numero_empleado || 'EMP-000'}</p>
                </div>
                <img src={obtenerAvatar(usuarioGuardado?.rol)} alt="Usuario Admin" />
            </div>

            <div className="MenuAdmin" id="M_admin">
                <Link to="/usuarios" className="icono-grande">
                    <IconoUsuarios className="icono-svg" />
                    <span>Gestión de usuarios</span>
                </Link>
                <Link to="/productos" className="icono-grande">
                    <IconoProductos className="icono-svg" />
                    <span>Gestión de productos</span>
                </Link>
                <Link to="/dashboard" className="icono-grande">
                    <IconoDashboard className="icono-svg" />
                    <span>Dashboard de métricas</span>
                </Link>
                <Link to="/qr" className="icono-grande">
                    <IconoQR className="icono-svg" />
                    <span>Generar QR</span>
                </Link>
                <Link to="/reportes" className="icono-grande">
                    <IconoReportes className="icono-svg" />
                    <span>Reportes de daños</span>
                </Link>
                <Link to="/ia" className="icono-grande">
                    <IconoIA className="icono-svg" />
                    <span>Generar informe IA</span>
                </Link>
            </div>

            {/* 👈 Barra de navegación reutilizable */}
            <BarraNavegacion />
            
        </div>
    );
}

export default MenuAdminPage;