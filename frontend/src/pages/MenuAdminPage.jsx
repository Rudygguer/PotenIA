import { Link } from 'react-router-dom';
import '../styles/MenuAdminPage.css';

function MenuAdminPage() {
    return (
        <div className="MenuAdmin" id="M_admin">
            {/* En React, <a href> se cambia por <Link to> para no recargar la página */}
            <Link to="/productos" className="icono-grande">
                <img className="icono-normal" src="/icons/Gestion de productos.svg" alt="Productos" />
                <span>Gestión de productos</span>
            </Link>
            
            <Link to="/usuarios" className="icono-grande">
                <img className="icono-normal" src="/icons/Gestion de usuarios.svg" alt="Usuarios" />
                <span>Gestión de usuarios</span>
            </Link>

            <Link to="/dashboard" className="icono-grande">
                <img className="icono-normal" src="/icons/Dashboard metricas.svg" alt="Dashboard" />
                <span>Dashboard de métricas</span>
            </Link>

            {/* Agrega los demás enlaces aquí... */}
        </div>
    );
}

export default MenuAdminPage;