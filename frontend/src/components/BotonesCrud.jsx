import IconoNuevo from '../../public/icons/nuevo.svg?react';
import IconoEditar from '../../public/icons/editar.svg?react';
import IconoEliminar from '../../public/icons/eliminar.svg?react';
import IconoReactivar from '../../public/icons/reactivar.svg?react';

function BotonesCrud({ onNuevo, onEditar, onEliminar, onReactivar, mostrarReactivar }) {
    return (
        <div className="botones-crud-inferiores">
            <button className="btn-crud-accion" onClick={onNuevo}>
                <div className="circulo-icono"><IconoNuevo /></div>
                <span className="texto-btn">Nuevo</span>
            </button>

            <button className="btn-crud-accion" onClick={onEditar}>
                <div className="circulo-icono"><IconoEditar /></div>
                <span className="texto-btn">Editar</span>
            </button>

            {mostrarReactivar ? (
                <button className="btn-crud-accion btn-reactivar" onClick={onReactivar}>
                    <div className="circulo-icono"><IconoReactivar /></div>
                    <span className="texto-btn">Reactivar</span>
                </button>
            ) : (
                <button className="btn-crud-accion btn-eliminar-texto" onClick={onEliminar}>
                    <div className="circulo-icono"><IconoEliminar /></div>
                    <span className="texto-btn">Eliminar</span>
                </button>
            )}
        </div>
    );
}

export default BotonesCrud;