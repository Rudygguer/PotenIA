// 1. IMPORTACIONES - la primera nos permite crear memoria, la segunda navegar entre paginas y la tercera son los estilos para ESTA pagina
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; 

// 2. COMPONENTE
function LoginPage() {
    // 3. ESTADOS (La memoria de React)
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigate = useNavigate();

    // 4. FUNCIÓN AL HACER CLIC EN EL BOTÓN -- 
    const handleLogin = (e) => {  // la (e) es el evento, la pagina recopila la info en el objeto e
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
        
        console.log("Datos ingresados:", usuario, contrasena);
        
        // Simulamos que el login es correcto y vamos a la página /admin
        navigate('/admin'); 
    };

    // 5. ESTRUCTURA VISUAL (El HTML)
    return (
        <div className="contenedor-principal-login">
            
            {/* EL LOGO */}
            <div className="Logo-PotenIA">
                <img 
                    className="icono-medio" 
                    src="/imagenes/Logo Potenia.png" 
                    alt="Logo de PotenIA" 
                />
            </div>

            {/* LA CAJA DEL FORMULARIO */}
            <div className="contenedor-login">
                <form className="FormularioLogin" onSubmit={handleLogin}>
                    
                    <label htmlFor="usuario">Usuario</label>
                    <input 
                        type="text" 
                        id="usuario"
                        placeholder="Ingresa tu usuario" 
                        value={usuario} 
                        onChange={(e) => setUsuario(e.target.value)} 
                        required 
                    />

                    <label htmlFor="contrasena">Contraseña</label>
                    <input 
                        type="password" 
                        id="contrasena"
                        placeholder="Ingresa tu contraseña"
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