// Recibimos "children" (el contenido) y "tipo" (para el color) y "onClose" (para cerrar)
function Modal({ children, tipo = 'exito', onClose }) {
    
    // Si onClose no está definido, el fondo no cierra el modal
    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay' && onClose) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-caja ${tipo}`}>
                {children}
            </div>
        </div>
    );
}

export default Modal;