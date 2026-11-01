// primero van las importaciones

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GestionProductosPage.css';

import BotonSalir from '../components/BotonSalir';
import BarraNavegacion from '../components/BarraNavegacion';
import Modal from '../components/Modal';
import HeaderModulo from '../components/HeaderModulo';
import IconoProductos from '../../public/icons/Gestion de productos.svg?react';


function GestionProductosPage() {

//ESTADOS

const [productos, setProductos] = useState([]);
const [error, setError] = useState('');
const [busqueda, setBusqueda] = useState('')


//EFECTOS
    useEffect(() => {
        cargarProductos();
    }, []); 



//FUNCIONES
    const cargarProductos = async () => {
        try {
            const respuesta = await axios.get('http://localhost:3000/api/productos');
            setProductos(respuesta.data);
        } catch (error) {
            console.error("Error al cargar productos", error);
            setError("No se pudo conectar con el servidor. ¿Está encendido el backend?");
        }
    };

 const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

// EL RENDERIZADO (JSX)
    return (
        <div className="contenedor-principal-admin">
            <BotonSalir />

            <HeaderModulo
                icono={<IconoProductos />}
                titulo="Gestión de Productos"
            />

            <div className="contenedor-lista-verde">

                {/* BARRA DE BÚSQUEDA */}
                <div className="barra-acciones-filtros">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="input-busqueda"
                    />
                </div>

                {/* LISTA DE PRODUCTOS */}
                <div className="lista-productos">
                    {productosFiltrados.map((producto) => (
                        <div key={producto.id_producto} className="item-productos">
                            <div className="info-productos">
                                <div>
                                    <span className="nombre-lista">{producto.nombre}</span>
                                    <span>Stock: {producto.stock} | {producto.nombre_empresa}</span>
                                    {' '}
                                    <span className="rol-badge">{producto.codigo}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {productosFiltrados.length === 0 && (
                        <p className="mensaje-vacio">No se encontraron productos</p>
                    )}
                </div>
            </div>

            {error && (
                <Modal tipo="error" onClose={() => setError('')}>
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button className="btn-modal" onClick={() => setError('')}>Aceptar</button>
                </Modal>
            )}

            <BarraNavegacion />
        </div>
    );
}

export default GestionProductosPage;