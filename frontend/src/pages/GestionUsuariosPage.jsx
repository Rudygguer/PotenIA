// primero van las importaciones

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GestionUsuariosPage.css';

import BotonSalir from '../components/BotonSalir';
import BarraNavegacion from '../components/BarraNavegacion';
import Modal from '../components/Modal';
import HeaderModulo from '../components/HeaderModulo';
import IconoUsuarios from '../../public/icons/Gestion de usuarios.svg?react'; 
import BotonesCrud from '../components/BotonesCrud';

function GestionUsuariosPage() {

//ESTADOS

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('todos');
    const [modalFormulario, setModalFormulario] = useState(false);
    const [editando, setEditando] = useState(false); 
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    
    const [modalAvatares, setModalAvatares] = useState(false);
    const [indiceAvatar, setIndiceAvatar] = useState(0);
    const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState(false);

    const listaAvatares = [
        'admin_hombre_1.jpeg', 
        'admin_hombre_2.jpeg',
        'admin_mujer_1.jpeg', 
        'admin_mujer_2.jpeg',
        'almacenista_hombre_1.jpeg', 
        'almacenista_hombre_2.jpeg', 
        'almacenista_mujer_1.jpeg',
        'almacenista_mujer_2.jpeg',  
        'Logo_Potenia.png' 
    ];
    
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rol: 'almacenista', 
        password: '',
        avatar: listaAvatares[0]
    });

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

//EFECTOS
    useEffect(() => {
        cargarUsuarios();
    }, []); 

//FUNCIONES
    const cargarUsuarios = async () => {
        try {
            const respuesta = await axios.get('http://localhost:3000/api/usuarios');
            setUsuarios(respuesta.data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
            setError("No se pudo conectar con el servidor. ¿Está encendido el backend?");
        }
    };

    const abrirCrear = () => {
        setEditando(false);
        setUsuarioSeleccionado(null); 
        setFormData({ nombre: '', email: '', rol: 'almacenista', password: '', avatar: listaAvatares[0] });
        setModalFormulario(true);
    };

    const abrirEditar = () => { 
        if (!usuarioSeleccionado) {
            setError('Por favor, selecciona un usuario de la lista primero.');
            return;
        }
        setEditando(true); 
        setFormData({ 
            nombre: usuarioSeleccionado.nombre, 
            email: usuarioSeleccionado.email, 
            rol: usuarioSeleccionado.rol, 
            password: '', 
            avatar: usuarioSeleccionado.avatar || listaAvatares[0] 
        });
        setModalFormulario(true); 
    };

    const guardarUsuario = async (e) => {
        e.preventDefault(); 
        try {
            if (editando) {
                await axios.put(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id_usuario}`, {
                    nombre: formData.nombre,
                    email: formData.email,
                    rol: formData.rol,
                    avatar: formData.avatar,
                    password: formData.password
                });
                setExito('Usuario actualizado correctamente');
            } else {
                await axios.post('http://localhost:3000/api/usuarios', formData);
                setExito('Usuario creado correctamente');
            }
            setModalFormulario(false); 
            cargarUsuarios(); 
            setUsuarioSeleccionado(null); 
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.mensaje); 
            } else {
                setError('Error de conexión');
            }
        }
    };

    const solicitarEliminar = () => {
        if (!usuarioSeleccionado) {
            setError('Por favor, selecciona un usuario de la lista primero.');
            return;
        }
        setModalConfirmarEliminar(true);
    };

    const ejecutarEliminar = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id_usuario}`);
            setExito('Usuario desactivado');
            setModalConfirmarEliminar(false);
            cargarUsuarios(); 
            setUsuarioSeleccionado(null); 
        } catch (err) {
            setError('Error al eliminar el usuario');
            setModalConfirmarEliminar(false);
        }
    };

    const reactivarUsuario = async () => {
        try {
            await axios.put(`http://localhost:3000/api/usuarios/reactivar/${usuarioSeleccionado.id_usuario}`);
            setExito('Usuario reactivado correctamente');
            setUsuarioSeleccionado(null);
            cargarUsuarios(); 
        } catch (err) {
            setError('Error al reactivar el usuario');
        }
    };

    const siguienteAvatar = () => {
        setIndiceAvatar((prev) => (prev + 1) % listaAvatares.length);
    };

    const anteriorAvatar = () => {
        setIndiceAvatar((prev) => (prev - 1 + listaAvatares.length) % listaAvatares.length);
    };

    const confirmarAvatar = () => {
        setFormData({...formData, avatar: listaAvatares[indiceAvatar]});
        setModalAvatares(false);
    };

// EL RENDERIZADO (JSX)
    return ( 
        <div className="contenedor-principal-admin">            
            <BotonSalir />
            
            <HeaderModulo 
                icono={<IconoUsuarios />} 
                titulo="Gestión de usuarios" 
            />

            <div className="contenedor-lista-verde">
                
                {/* BARRA DE BÚSQUEDA Y FILTRO */}
                <div className="barra-acciones-filtros">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre..." 
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)} 
                        className="input-busqueda"
                    />
                    <select 
                        value={filtroRol} 
                        onChange={(e) => setFiltroRol(e.target.value)}
                        className="select-filtro"
                    >
                        <option value="todos">Todos los roles</option>
                        <option value="admin">Administradores</option>
                        <option value="almacenista">Almacenistas</option>
                    </select>
                </div>

                {/* LISTA DE USUARIOS */}
                <div className="lista-usuarios">
                    {usuarios
                        .filter(user => {
                            const coincideNombre = user.nombre.toLowerCase().includes(busqueda.toLowerCase());
                            const coincideRol = filtroRol === 'todos' || user.rol === filtroRol;
                            return coincideNombre && coincideRol;
                        }) 
                        .map((user) => ( 
                            <div 
                                key={user.id_usuario} 
                                className={`item-usuario ${!user.activo ? 'inactivo' : ''} ${usuarioSeleccionado?.id_usuario === user.id_usuario ? 'seleccionado' : ''}`}
                                onClick={() => setUsuarioSeleccionado(user)}
                            >
                                <div className="info-usuario-lista">
                                    <img src={`/imagenes/avatares/${user.avatar}`} alt="Avatar" className="avatar-miniatura" />
                                    <div>
                                        <span className="nombre-lista">{user.nombre}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color:'var(--azul)' }}>{user.numero_empleado} </span> &nbsp; &nbsp; &nbsp; 
                                        <span className="rol-badge">{user.rol}</span>
                                    </div>
                                </div>
                            </div>
                    ))}
                    {usuarios.filter(user => user.nombre.toLowerCase().includes(busqueda.toLowerCase()) && (filtroRol === 'todos' || user.rol === filtroRol)).length === 0 && (
                        <p className="mensaje-vacio">No se encontraron usuarios</p>
                    )}
                </div>

                        <BotonesCrud
                            onNuevo={abrirCrear}
                            onEditar={abrirEditar}
                            onEliminar={solicitarEliminar}
                            onReactivar={reactivarUsuario}
                            mostrarReactivar={usuarioSeleccionado && !usuarioSeleccionado.activo}
                        />
                
            </div> 

            {/* MODAL: FORMULARIO CREAR/EDITAR */}
            {modalFormulario && (
                <Modal tipo="exito" onClose={() => setModalFormulario(false)}>
                    <h3>{editando ? 'Editar Usuario' : 'Registrar Usuario'}</h3>
                    <form onSubmit={guardarUsuario} className="formulario-usuario">
                        
                        <label>Nombre Completo</label>
                        <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />

                        {/* NUEVO: Mostrar número de empleado solo cuando se está editando */}
                        {editando && (
                            <>
                                <label>Número de Empleado</label>
                                <input 
                                    type="text" 
                                    value={usuarioSeleccionado?.numero_empleado || ''} 
                                    disabled 
                                    style={{ backgroundColor: '#e0e0e0', color: '#666', cursor: 'not-allowed' }}
                                />
                            </>
                        )}

                        <label>Correo Electrónico</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        
                        <label>{editando ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}</label>
                        <input 
                            type="password" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            /*  required={!editando} hace que sea obligatorio al crear, pero opcional al editar */
                            required={!editando} 
                            placeholder={editando ? "Dejar en blanco para mantener la actual" : ""}
                        />

                        <label>Rol</label>
                        <select value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}>
                            <option value="admin">Administrador</option>
                            <option value="almacenista">Almacenista</option>
                        </select>

                        <label>Avatar Seleccionado</label>
                        <div className="avatar-actual-preview" onClick={() => {
                            const index = listaAvatares.indexOf(formData.avatar);
                            setIndiceAvatar(index >= 0 ? index : 0);
                            setModalAvatares(true);
                        }}>
                            <img src={`/imagenes/avatares/${formData.avatar}`} alt="Avatar actual" />
                            <span>Cambiar avatar</span>
                        </div>

                        <div className="botones-formulario">
                            <button type="button" className="btn-cancelar" onClick={() => setModalFormulario(false)}>Cancelar</button>
                            <button type="submit" className="btn-guardar">{editando ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* MODAL: SELECTOR DE AVATARES */}
            {modalAvatares && (
                <Modal tipo="exito" onClose={() => setModalAvatares(false)}>
                    <h3>Selecciona tu Avatar</h3>
                    <div className="carrusel-avatares">
                        <button type="button" className="btn-flecha" onClick={anteriorAvatar}>❮</button>
                        <div className="avatar-grande-contenedor">
                            <img src={`/imagenes/avatares/${listaAvatares[indiceAvatar]}`} alt="Avatar grande" className="avatar-grande" />
                        </div>
                        <button type="button" className="btn-flecha" onClick={siguienteAvatar}>❯</button>
                    </div>
                    <div className="botones-formulario" style={{marginTop: '20px'}}>
                        <button type="button" className="btn-cancelar" onClick={() => setModalAvatares(false)}>Cancelar</button>
                        <button type="button" className="btn-guardar" onClick={confirmarAvatar}>Seleccionar</button>
                    </div>
                </Modal>
            )}

            {/* MODAL: CONFIRMACIÓN DE ELIMINAR */}
            {modalConfirmarEliminar && (
                <Modal tipo="error" onClose={() => setModalConfirmarEliminar(false)}>
                    <h3>Confirmar Acción</h3>
                    <p>¿Estás seguro de que deseas desactivar a <strong>{usuarioSeleccionado?.nombre}</strong>?</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--azulClaro)', marginTop: '10px' }}>
                        El usuario no se borrará de la base de datos, solo perderá el acceso al sistema.
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

            {error && (
                <Modal tipo="error" onClose={() => setError('')}>
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button className="btn-modal" onClick={() => setError('')}>Aceptar</button>
                </Modal>
            )}

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

export default GestionUsuariosPage;