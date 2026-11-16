// ---------- IMPORTACIONES ----------
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GestionUsuariosPage.css'; // reutilizamos estilos de lista, formulario, carrusel y modales

import BotonSalir from '../components/BotonSalir';
import BarraNavegacion from '../components/BarraNavegacion';
import BotonesCrud from '../components/BotonesCrud';
import Modal from '../components/Modal';
import HeaderModulo from '../components/HeaderModulo';
// Ícono propio de proveedores (archivo en frontend/public/icons/)
import IconoProveedores from '../../public/icons/Gestion de proveedores.svg?react';


const URL_API = 'http://localhost:3000/api';

// Íconos disponibles: son archivos de public/imagenes/proveedores/.
// Esta lista debe ser igual a AVATARES_VALIDOS de proveedorController.js
const listaAvatares = [
    'proveedor_caja.svg', 'proveedor_camion.svg', 'proveedor_fabrica.svg', 'proveedor_bodega.svg',
    'proveedor_tienda.svg', 'proveedor_contenedor.svg', 'proveedor_etiqueta.svg', 'proveedor_globo.svg'
];

// Formulario vacío. Está FUERA del componente porque no cambia y se usa en dos sitios.
const formularioVacio = {
    nombre_empresa: '',
    persona_contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    avatar: listaAvatares[0]
};

function GestionProveedoresPage() {

    // ---------- ESTADOS ----------
    const [proveedores, setProveedores] = useState([]);           // lista que llega del backend
    const [busqueda, setBusqueda] = useState('');                  // texto del buscador
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [editando, setEditando] = useState(false);               // false = crear, true = editar
    const [formData, setFormData] = useState(formularioVacio);
    const [modalFormulario, setModalFormulario] = useState(false);
    const [modalAvatares, setModalAvatares] = useState(false);     // carrusel de íconos
    const [indiceAvatar, setIndiceAvatar] = useState(0);           // cuál ícono se ve en el carrusel
    const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    // ---------- EFECTO ----------
    // Al abrir la página (una sola vez, por el []) pedimos la lista
    useEffect(() => {
        cargarProveedores();
    }, []);

    // ---------- FUNCIONES: CARGAR DATOS ----------
    const cargarProveedores = async () => {
        try {
            const respuesta = await axios.get(`${URL_API}/proveedores/resumen`);
            setProveedores(respuesta.data);
        } catch (err) {
            console.error('Error al cargar proveedores', err);
            setError(err.response?.data?.mensaje || 'No se pudo conectar con el servidor. ¿Está encendido el backend?');
        }
    };

    // ---------- FUNCIONES: ABRIR FORMULARIOS ----------
    const abrirCrear = () => {
        setEditando(false);
        setProveedorSeleccionado(null);
        setFormData(formularioVacio);
        setModalFormulario(true);
    };

    const abrirEditar = () => {
        if (!proveedorSeleccionado) {
            setError('Por favor, selecciona un proveedor de la lista primero.');
            return;
        }
        setEditando(true);
        setFormData({
            nombre_empresa: proveedorSeleccionado.nombre_empresa,
            persona_contacto: proveedorSeleccionado.persona_contacto || '', // null → ''
            telefono: proveedorSeleccionado.telefono,
            email: proveedorSeleccionado.email,
            direccion: proveedorSeleccionado.direccion,
            avatar: proveedorSeleccionado.avatar || listaAvatares[0]
        });
        setModalFormulario(true);
    };

    // ---------- FUNCIONES: GUARDAR (crear o editar) ----------
    // Las validaciones las hace el backend; aquí solo mostramos el mensaje que responda.
    const guardarProveedor = async (e) => {
        e.preventDefault(); // evita que el navegador recargue la página
        try {
            if (editando) {
                await axios.put(`${URL_API}/proveedores/${proveedorSeleccionado.id_proveedor}`, formData);
                setExito('Proveedor actualizado correctamente');
            } else {
                await axios.post(`${URL_API}/proveedores`, formData);
                setExito('Proveedor creado correctamente');
            }
            setModalFormulario(false);
            cargarProveedores();            // recargamos la lista para ver el cambio
            setProveedorSeleccionado(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error de conexión');
        }
    };

    // ---------- FUNCIONES: DESACTIVAR Y REACTIVAR ----------
    const solicitarEliminar = () => {
        if (!proveedorSeleccionado) {
            setError('Por favor, selecciona un proveedor de la lista primero.');
            return;
        }
        setModalConfirmarEliminar(true); // primero pedimos confirmación
    };

    const ejecutarEliminar = async () => {
        try {
            await axios.delete(`${URL_API}/proveedores/${proveedorSeleccionado.id_proveedor}`);
            setExito('Proveedor desactivado');
            setModalConfirmarEliminar(false);
            cargarProveedores();
            setProveedorSeleccionado(null);
        } catch (err) {
            // Aquí llega el mensaje de la regla B (si el proveedor tiene stock)
            setError(err.response?.data?.mensaje || 'Error al desactivar el proveedor');
            setModalConfirmarEliminar(false);
        }
    };

    const reactivarProveedor = async () => {
        try {
            await axios.put(`${URL_API}/proveedores/reactivar/${proveedorSeleccionado.id_proveedor}`);
            setExito('Proveedor reactivado correctamente');
            cargarProveedores();
            setProveedorSeleccionado(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al reactivar el proveedor');
        }
    };

    // ---------- FUNCIONES: CARRUSEL DE ÍCONOS ----------
    // El % (módulo) hace que al pasar del último vuelva al primero, y al revés
    const siguienteAvatar = () => {
        setIndiceAvatar((prev) => (prev + 1) % listaAvatares.length);
    };

    const anteriorAvatar = () => {
        setIndiceAvatar((prev) => (prev - 1 + listaAvatares.length) % listaAvatares.length);
    };

    const confirmarAvatar = () => {
        setFormData({ ...formData, avatar: listaAvatares[indiceAvatar] });
        setModalAvatares(false);
    };

    // ---------- DATOS DERIVADOS ----------
    // Lista nueva con solo los proveedores cuyo nombre contiene lo buscado (sin importar mayúsculas)
    const proveedoresFiltrados = proveedores.filter(proveedor =>
        proveedor.nombre_empresa.toLowerCase().includes(busqueda.toLowerCase())
    );

    // ---------- RENDERIZADO ----------
    return (
        <div className="contenedor-principal-admin">
            <BotonSalir />

            <HeaderModulo icono={<IconoProveedores />} titulo="Gestión de Proveedores" />

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

                {/* LISTA: un elemento por cada proveedor filtrado */}
                <div className="lista-usuarios">
                    {proveedoresFiltrados.map((proveedor) => (
                        <div
                            key={proveedor.id_proveedor}
                            className={`item-usuario ${!proveedor.activo ? 'inactivo' : ''} ${proveedorSeleccionado?.id_proveedor === proveedor.id_proveedor ? 'seleccionado' : ''}`}
                            onClick={() => setProveedorSeleccionado(proveedor)}
                        >
                            <div className="info-usuario-lista">
                                <img
                                    src={`/imagenes/proveedores/${proveedor.avatar}`}
                                    alt="Ícono del proveedor"
                                    className="avatar-miniatura"
                                />
                                <div>
                                    <span className="nombre-lista">{proveedor.nombre_empresa}</span>
                                    <span style={{ fontSize: '0.8rem' }}>
                                        Productos: {proveedor.total_productos} | Stock total: {proveedor.stock_total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Mensaje si el filtro no deja ningún proveedor */}
                    {proveedoresFiltrados.length === 0 && (
                        <p className="mensaje-vacio">No se encontraron proveedores</p>
                    )}
                </div>

                {/* BOTONES: Nuevo, Editar, Eliminar/Reactivar */}
                <BotonesCrud
                    onNuevo={abrirCrear}
                    onEditar={abrirEditar}
                    onEliminar={solicitarEliminar}
                    onReactivar={reactivarProveedor}
                    mostrarReactivar={proveedorSeleccionado && !proveedorSeleccionado.activo}
                />
            </div>

            {/* MODAL: FORMULARIO CREAR / EDITAR */}
            {modalFormulario && (
                <Modal tipo="exito" onClose={() => setModalFormulario(false)}>
                    <h3>{editando ? 'Editar Proveedor' : 'Registrar Proveedor'}</h3>
                    <form onSubmit={guardarProveedor} className="formulario-usuario" noValidate>

                        <label>Nombre de la empresa</label>
                        <input
                            type="text"
                            maxLength={200}
                            value={formData.nombre_empresa}
                            onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
                        />

                        <label>Persona de contacto (opcional)</label>
                        <input
                            type="text"
                            maxLength={200}
                            value={formData.persona_contacto}
                            onChange={(e) => setFormData({ ...formData, persona_contacto: e.target.value })}
                        />

                        <label>Teléfono</label>
                        <input
                            type="text"
                            maxLength={30}
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        />

                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            maxLength={150}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <label>Dirección</label>
                        <input
                            type="text"
                            maxLength={200}
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        />

                        {/* ÍCONO: al hacer clic se abre el carrusel */}
                        <label>Ícono seleccionado</label>
                        <div className="avatar-actual-preview" onClick={() => {
                            const index = listaAvatares.indexOf(formData.avatar);
                            setIndiceAvatar(index >= 0 ? index : 0);
                            setModalAvatares(true);
                        }}>
                            <img src={`/imagenes/proveedores/${formData.avatar}`} alt="Ícono actual" />
                            <span>Cambiar ícono</span>
                        </div>

                        <div className="botones-formulario">
                            <button type="button" className="btn-cancelar" onClick={() => setModalFormulario(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-guardar">
                                {editando ? 'Guardar Cambios' : 'Crear Proveedor'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* MODAL: CARRUSEL DE ÍCONOS */}
            {modalAvatares && (
                <Modal tipo="exito" onClose={() => setModalAvatares(false)}>
                    <h3>Selecciona un ícono</h3>
                    <div className="carrusel-avatares">
                        <button type="button" className="btn-flecha" onClick={anteriorAvatar}>❮</button>
                        <div className="avatar-grande-contenedor">
                            <img
                                src={`/imagenes/proveedores/${listaAvatares[indiceAvatar]}`}
                                alt="Ícono grande"
                                className="avatar-grande"
                            />
                        </div>
                        <button type="button" className="btn-flecha" onClick={siguienteAvatar}>❯</button>
                    </div>
                    <div className="botones-formulario" style={{ marginTop: '20px' }}>
                        <button type="button" className="btn-cancelar" onClick={() => setModalAvatares(false)}>Cancelar</button>
                        <button type="button" className="btn-guardar" onClick={confirmarAvatar}>Seleccionar</button>
                    </div>
                </Modal>
            )}

            {/* MODAL: CONFIRMAR DESACTIVAR */}
            {modalConfirmarEliminar && (
                <Modal tipo="error" onClose={() => setModalConfirmarEliminar(false)}>
                    <h3>Confirmar Acción</h3>
                    <p>¿Seguro que deseas desactivar a <strong>{proveedorSeleccionado?.nombre_empresa}</strong>?</p>
                    <p style={{ fontSize: '0.85rem' }}>
                        El proveedor no se borra de la base de datos, solo se desactiva.
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

export default GestionProveedoresPage;
