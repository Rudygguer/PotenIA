import { useNavigate } from 'react-router-dom';
import IconoAtras from '../../public/icons/Atras.svg?react';
import IconoMenu from '../../public/icons/Menu.svg?react';
import IconoAdelante from '../../public/icons/Adelante.svg?react';

function BarraNavegacion() {
    const navigate = useNavigate();

    return (
        <div className="navegacion" id="botones_navegacion">
            <button onClick={() => navigate(-1)} className="icono-pequeno">
                <IconoAtras className="icono-svg-pequeno" />
            </button>
            
            <button onClick={() => navigate('/admin')} className="icono-pequeno">
                <IconoMenu className="icono-svg-pequeno" />
            </button>
            
            <button onClick={() => navigate(1)} className="icono-pequeno">
                <IconoAdelante className="icono-svg-pequeno" />
            </button>
        </div>
    );
}

export default BarraNavegacion;