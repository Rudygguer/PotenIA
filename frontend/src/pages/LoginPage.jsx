// 1. IMPORTACIONES - la primera nos permite crear memoria, la segunda navegar entre paginas y la tercera son los estilos para ESTA pagina
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importamos Axios para hacer peticiones HTTP
import '../styles/LoginPage.css'; 

// 2. COMPONENTE
function LoginPage() {
    // 3. ESTADOS (La memoria de React)
    // CAMBIO AQUÍ: Usamos numeroEmpleado para que coincida con los inputs
    const [numeroEmpleado, setNumeroEmpleado] = useState(''); 
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState(''); // Para mostrar errores si falla

    const navigate = useNavigate();

    // 2. Función que se ejecuta al enviar el formulario
    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError(''); // Limpiamos errores anteriores

        try {
            // 3. Enviamos los datos al Backend usando Axios
            // axios.post(URL, DATOS)
            const respuesta = await axios.post('http://localhost:3000/api/auth/login', {
                numero_empleado: numeroEmpleado, // Ahora sí, la variable existe
                password: contrasena
            });

            // 4. Si la respuesta es exitosa (el servidor nos devolvió los datos)
            console.log("Respuesta del servidor:", respuesta.data);
            
            // Guardamos los datos del usuario en el navegador (localStorage)
            localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));

            // Redirigimos según el rol
            if (respuesta.data.usuario.rol === 'admin') {
                navigate('/admin');
            } else {
                // navigate('/almacenista'); // Lo haremos luego
                alert("Eres almacenista, aún no tenemos esa vista");
            }

        } catch (err) {
            // 5. Si hay un error (contraseña mal, servidor caído, etc.)
            if (err.response && err.response.data) {
                setError(err.response.data.mensaje); // Mensaje del backend
            } else {
                setError('Error de conexión con el servidor');
            }
        }
    };

    return (
        <div className="contenedor-principal-login">
            <div className="Logo-PotenIA">
                <img className="icono-medio" src="/imagenes/Logo Potenia.png" alt="Logo" />
            </div>

            <div className="contenedor-login">
                <form className="FormularioLogin" onSubmit={handleLogin}>
                    
                    {/* Mostramos el error si es que hay uno */}
                    {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

                    <label htmlFor="usuario">Número de Empleado</label>
                    <input 
                        type="text" 
                        id="usuario"
                        placeholder="Inicia con EMP y los dígitos asignados" 
                        value={numeroEmpleado} // Ahora sí
                        onChange={(e) => setNumeroEmpleado(e.target.value)} // Ahora sí
                        required 
                    />

                    <label htmlFor="contrasena">Contraseña</label>
                    <input 
                        type="password" 
                        id="contrasena"
                        placeholder="Tu contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)} 
                        required 
                    />

                    <button type="submit" id="btnIniciar">Iniciar sesión</button>
                </form>

                <div className="enlaces">
                    <a href="#">Olvidé mi contraseña</a>  {/* aqui luego tengo que conectarlo a la base de datos */}
                    <a href="#">Crear usuario</a>         {/* se debe poder crear usuario pero primero pide autenticar con admin o solo le dice que se ponga en contacto con un admin*/}
                </div>
            </div>
            
        </div>
    );
}

export default LoginPage;