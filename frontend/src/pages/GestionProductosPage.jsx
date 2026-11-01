// ---------- IMPORTACIONES ----------
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GestionUsuariosPage.css'; // estilos de lista, formulario y botones de modales

import BotonSalir from '../components/BotonSalir';
import BarraNavegacion from '../components/BarraNavegacion';
import BotonesCrud from '../components/BotonesCrud';
import Modal from '../components/Modal';
import HeaderModulo from '../components/HeaderModulo';
import IconoProductos from '../../public/icons/Gestion de productos.svg?react';

// Dirección base del backend, para no repetirla en cada petición
const URL_API = 'http://localhost:3000/api';

// Aspecto del formulario vacío. Está FUERA del componente porque no cambia
// y lo usamos en dos sitios (estado inicial y abrirCrear).
const formularioVacio = {
    nombre: '',
    descripcion_producto: '',
    stock: 0,
    condiciones_guardado: '',
    id_proveedor: '',
    id_ubicacion: ''
};

function GestionProductosPage() {

    // ---------- ESTADOS (la memoria de la página) ----------
    const [productos, setProductos] = useState([]);       // lista que llega del backend
    const [proveedores, setProveedores] = useState([]);   // opciones del select de proveedor
    const [ubicaciones, setUbicaciones] = useState([]);   // opciones del select de ubicación
    const [busqueda, setBusqueda] = useState('');          // texto del buscador
    const [productoSeleccionado, setProductoSeleccionado] = useState(null); // null = nadie seleccionado
    const [editando, setEditando] = useState(false);       // false = crear, true = editar
    const [formData, setFormData] = useState(formularioVacio); // lo que se escribe en el formulario
    const [modalFormulario, setModalFormulario] = useState(false);
    const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    // ---------- EFECTO ----------
    // Al abrir la página (una sola vez, por el []) pedimos las tres listas
    useEffect(() => {
        cargarProductos();
        cargarProveedores();
        cargarUbicaciones();
    }, []);

    // ---------- FUNCIONES: CARGAR DATOS ----------
    const cargarProductos = async () => {
        try {
            const respuesta = await axios.get(`${URL_API}/productos`);
            setProductos(respuesta.data);
        } catch (err) {
            console.error('Error al cargar productos', err);
            setError('No se pudo conectar con el servidor. ¿Está encendido el backend?');
        }
    };

    const cargarProveedores = async () => {
        try {
            const respuesta = await axios.get(`${URL_API}/proveedores`);
            setProveedores(respuesta.data);
        } catch (err) {
            console.error('Error al cargar proveedores', err);
            setError('No se pudieron cargar los proveedores');
        }
    };

    const cargarUbicaciones = async () => {
        try {
            const respuesta = await axios.get(`${URL_API}/ubicaciones`);
            setUbicaciones(respuesta.data);
        } catch (err) {
            console.error('Error al cargar ubicaciones', err);
            setError('No se pudieron cargar las ubicaciones');
        }
    };

    // ---------- FUNCIONES: ABRIR FORMULARIOS ----------
    // Botón "Nuevo": formulario vacío en modo crear
    const abrirCrear = () => {
        setEditando(false);
        setProductoSeleccionado(null);
        setFormData(formularioVacio);
        setModalFormulario(true);
    };

    // Botón "Editar": formulario lleno con el producto seleccionado
    const abrirEditar = () => {
        if (!productoSeleccionado) {
            setError('Por favor, selecciona un producto de la lista primero.');
            return; // salimos de la función sin abrir nada
        }
        setEditando(true);
        setFormData({
            nombre: productoSeleccionado.nombre,
            descripcion_producto: productoSeleccionado.descripcion_producto,
            stock: productoSeleccionado.stock,
            condiciones_guardado: productoSeleccionado.condiciones_guardado || '', // null → ''
            id_proveedor: productoSeleccionado.id_proveedor,
            id_ubicacion: productoSeleccionado.id_ubicacion
        });
        setModalFormulario(true);
    };

    // ---------- FUNCIONES: GUARDAR (crear o editar) ----------
    const guardarProducto = async (e) => {
        e.preventDefault(); // evita que el navegador recargue la página al enviar

        if (formData.stock < 0 ) {
            setError ('Stock debe ser un entero mayor o igual a 0');
            return;
        }
        if (!formData.nombre.trim() || !formData.descripcion_producto.trim()) {  
            setError ('Los campos nombre y descripción no pueden quedar vacíos');
            return;
            }
        if (!formData.id_proveedor || !formData.id_ubicacion) {  
            setError ('Los campos proveedor y ubicación no pueden quedar vacíos');
            return;
            }

        try {
            if (editando) {
                // PUT = editar. El id va en la URL
                await axios.put(`${URL_API}/productos/${productoSeleccionado.id_producto}`, formData);
                setExito('Producto actualizado correctamente');
            } else {
                // POST = crear
                await axios.post(`${URL_API}/productos`, formData);
                setExito('Producto creado correctamente');
            }
            setModalFormulario(false);
            cargarProductos();               // recargamos la lista para ver el cambio
            setProductoSeleccionado(null);
        } catch (err) {
            // Si el backend respondió con un mensaje (400, 404...), lo mostramos
            setError(err.response?.data?.mensaje || 'Error de conexión');
        }
    };

    // ---------- FUNCIONES: DESACTIVAR Y REACTIVAR ----------
    const solicitarEliminar = () => {
        if (!productoSeleccionado) {
            setError('Por favor, selecciona un producto de la lista primero.');
            return;
        }
        setModalConfirmarEliminar(true); // primero pedimos confirmación
    };

    const ejecutarEliminar = async () => {
        try {
            await axios.delete(`${URL_API}/productos/${productoSeleccionado.id_producto}`);
            setExito('Producto desactivado');
            setModalConfirmarEliminar(false);
            cargarProductos();
            setProductoSeleccionado(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al desactivar el producto');
            setModalConfirmarEliminar(false);
        }
    };

    const reactivarProducto = async () => {
        try {
            await axios.put(`${URL_API}/productos/reactivar/${productoSeleccionado.id_producto}`);
            setExito('Producto reactivado correctamente');
            cargarProductos();
            setProductoSeleccionado(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al reactivar el producto');
        }
    };

    // ---------- DATOS DERIVADOS ----------
    // Lista nueva con solo los productos cuyo nombre contiene lo buscado (sin importar mayúsculas)
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ---------- RENDERIZADO (lo que se ve en pantalla) ----------
    return (
        <div className="contenedor-principal-admin">
            <BotonSalir />

            <HeaderModulo icono={<IconoProductos />} titulo="Gestión de Productos" />

            <div className="contenedor-lista-verde">

                {/* BUSCADOR */}
                <div className="barra-acciones-filtros">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="input-busqueda"
                    />
                </div>

                {/* LISTA: un elemento por cada producto filtrado */}
                <div className="lista-usuarios">
                    {productosFiltrados.map((producto) => (
                        <div
                            key={producto.id_producto}
                            className={`item-usuario ${!producto.activo ? 'inactivo' : ''} ${productoSeleccionado?.id_producto === producto.id_producto ? 'seleccionado' : ''}`}
                            onClick={() => setProductoSeleccionado(producto)}
                        >
                            <div className="info-usuario-lista">
                                <div>
                                    <span className="nombre-lista">{producto.nombre}</span>
                                    <span style={{ fontSize: '0.8rem' }}>
                                        Stock: {producto.stock} | {producto.nombre_empresa}
                                    </span>{' '}
                                    <span className="rol-badge">{producto.codigo}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Mensaje si el filtro no deja ningún producto */}
                    {productosFiltrados.length === 0 && (
                        <p className="mensaje-vacio">No se encontraron productos</p>
                    )}
                </div>

                {/* BOTONES: Nuevo, Editar, Eliminar/Reactivar */}
                <BotonesCrud
                    onNuevo={abrirCrear}
                    onEditar={abrirEditar}
                    onEliminar={solicitarEliminar}
                    onReactivar={reactivarProducto}
                    mostrarReactivar={productoSeleccionado && !productoSeleccionado.activo}
                />
            </div>

            {/* MODAL: FORMULARIO CREAR / EDITAR */}
            {modalFormulario && (
                <Modal tipo="exito" onClose={() => setModalFormulario(false)}>
                    <h3>{editando ? 'Editar Producto' : 'Registrar Producto'}</h3>
                    <form onSubmit={guardarProducto} className="formulario-usuario" noValidate>

                        <label>Nombre</label>
                        <input
                            type="text"
                            maxLength={200}
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />

                        <label>Descripción</label>
                        <input
                            type="text"
                            maxLength={200}
                            value={formData.descripcion_producto}
                            onChange={(e) => setFormData({ ...formData, descripcion_producto: e.target.value })}
                            required
                        />

                        <label>Stock</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                        />

                        <label>Condiciones de guardado (opcional)</label>
                        <input
                            type="text"
                            maxLength={300}
                            value={formData.condiciones_guardado}
                            onChange={(e) => setFormData({ ...formData, condiciones_guardado: e.target.value })}
                        />

                        {/* LISTA DESPLEGABLE RELACIONADA: se ve el nombre, se guarda el id */}
                        <label>Proveedor</label>
                        <select
                            value={formData.id_proveedor}
                            onChange={(e) => setFormData({ ...formData, id_proveedor: e.target.value })}
                            required
                        >
                            <option value="">Selecciona un proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.nombre_empresa}
                                </option>
                            ))}
                        </select>

                        <label>Ubicación</label>
                        <select
                            value={formData.id_ubicacion}
                            onChange={(e) => setFormData({ ...formData, id_ubicacion: e.target.value })}
                            required
                        >
                            <option value="">Selecciona una ubicación</option>
                            {ubicaciones.map((ubicacion) => (
                                <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                                    {ubicacion.codigo}
                                </option>
                            ))}
                        </select>

                        <div className="botones-formulario">
                            <button type="button" className="btn-cancelar" onClick={() => setModalFormulario(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-guardar">
                                {editando ? 'Guardar Cambios' : 'Crear Producto'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* MODAL: CONFIRMAR DESACTIVAR */}
            {modalConfirmarEliminar && (
                <Modal tipo="error" onClose={() => setModalConfirmarEliminar(false)}>
                    <h3>Confirmar Acción</h3>
                    <p>¿Seguro que deseas desactivar <strong>{productoSeleccionado?.nombre}</strong>?</p>
                    <p style={{ fontSize: '0.85rem' }}>
                        El producto no se borra de la base de datos, solo se desactiva.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                        <button className="btn-cancelar" onClick={() => setModalConfirmarEliminar(false)}>
                            Cancelar
                        </button>
                        <button className="btn-eliminar" onClick={ejecutarEliminar}>
                            Sí, desactivar
                        </button>
                    </div>
                </Modal>
            )}

            {/* MODAL: ERROR */}
            {error && (
                <Modal tipo="error" onClose={() => setError('')}>
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button className="btn-modal" onClick={() => setError('')}>Aceptar</button>
                </Modal>
            )}

            {/* MODAL: ÉXITO */}
            {exito && (
                <Modal tipo="exito" onClose={() => setExito('')}>
                    <h3>¡Éxito!</h3>
                    <p>{exito}</p>
                    <button className="btn-modal" onClick={() => setExito('')}>Aceptar</button>
                </Modal>
            )}

            <BarraNavegacion />
        </div>
    );
}

export default GestionProductosPage;