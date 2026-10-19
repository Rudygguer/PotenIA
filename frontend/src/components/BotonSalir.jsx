import { useNavigate } from 'react-router-dom';
import IconoSalir from '../../public/icons/Salir.svg?react';

function BotonSalir() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('usuario'); 
        navigate('/login'); 
    };

    return (
        <div className="salida" id="boton_salida">
            <button onClick={handleLogout} className="btn-salir" title="Cerrar Sesión">
                <IconoSalir className="icono-svg-pequeno" />
            </button>
        </div>
    );
}

export default BotonSalir;