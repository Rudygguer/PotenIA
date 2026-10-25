# Módulo de Gestión de Usuarios (CRUD)

Este módulo permite al Administrador crear, leer, actualizar y desactivar (borrado lógico) a los usuarios del sistema.

## 🗄️ Base de Datos (PostgreSQL)
La tabla `usuarios` cuenta con los campos: `id_usuario`, `nombre`, `numero_empleado` (autogenerado), `email` (único), `password` (encriptado con bcrypt), `rol`, `avatar`, `activo` (booleano).

## 🛠️ Backend (Node.js + Express)

### Archivos involucrados
*   `src/controllers/usuarioController.js`: Lógica de negocio de los usuarios.
*   `src/routes/usuarioRoutes.js`: Definición de los endpoints.

### Endpoints

#### 1. Listar Usuarios (`GET /api/usuarios`)
*   **Lógica:** Consulta todos los usuarios de la base de datos y los devuelve en un arreglo JSON. (No devuelve contraseñas).

#### 2. Crear Usuario (`POST /api/usuarios`)
*   **Lógica:**
    *   Recibe nombre, email, password, rol y avatar.
    *   Valida que el correo electrónico no esté registrado previamente (si lo está, devuelve error `400`).
    *   Encripta la contraseña con `bcryptjs`.
    *   Inserta en la base de datos. El campo `numero_empleado` es generado automáticamente por PostgreSQL.

#### 3. Actualizar Usuario (`PUT /api/usuarios/:id`)
*   **Lógica:** Recibe nombre, email, rol y avatar. Actualiza el registro correspondiente al ID.

#### 4. Desactivar Usuario (Borrado Lógico) (`DELETE /api/usuarios/:id`)
*   **Lógica:** No elimina el registro de la base de datos. Cambia el campo `activo` a `false`.

#### 5. Reactivar Usuario (`PUT /api/usuarios/reactivar/:id`)
*   **Lógica:** Cambia el campo `activo` de vuelta a `true` para devolverle el acceso al usuario.

## ⚛️ Frontend (React)

### Archivos involucrados
*   `src/pages/GestionUsuariosPage.jsx`: Interfaz del CRUD.
*   `src/components/Modal.jsx`: Componente reutilizable para los diálogos.

### Características de la Interfaz
1.  **Listado Dinámico:** Se utiliza `useEffect` para cargar los usuarios al entrar a la página. Muestra una tarjeta por usuario con su avatar y rol.
2.  **Búsqueda y Filtros:** El usuario puede buscar por nombre (filtrando el arreglo en tiempo real) y filtrar por rol (Admin/Almacenista).
3.  **Modales de Acción:** 
    *   Formulario para Crear/Editar (con validación de campos obligatorios).
    *   Carrusel de selección de avatares (permite elegir entre 9 imágenes predefinidas).
    *   Modal de confirmación con bordes naranjas para advertir sobre la desactivación.
4.  **Mensajes de Feedback:** Uso de estados (`error`, `exito`) para mostrar modales de alerta según la respuesta del servidor.