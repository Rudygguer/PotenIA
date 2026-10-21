function HeaderModulo({ icono, titulo }) {
    return (
        <div className="tarjeta-modulo">
            <div className="icono-modulo">
                {icono}
            </div>
            <h2 className="texto-modulo">{titulo}</h2>
        </div>
    );
}

export default HeaderModulo;