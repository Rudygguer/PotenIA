# Módulo de Autenticación (Login)

Este módulo se encarga de validar las credenciales de los usuarios y permitirles el acceso al sistema PotenIA.

## 🛠️ Backend (Node.js + Express)

### Archivos involucrados
*   `src/controllers/authController.js`: Contiene la lógica de validación.
*   `src/routes/authRoutes.js`: Define la ruta de acceso.

### Lógica de Negocio
1.  Recibe el `numero_empleado` y la `password`.
2.  Busca al usuario en la base de datos PostgreSQL.
3.  **Validaciones:**
    *   Si el usuario no existe, devuelve error `401` (No autorizado).
    *   Si el usuario existe pero está inactivo (`activo = false`), devuelve error `403` (Prohibido) con el mensaje: *"Tu usuario está desactivado. Contacta al administrador"*.
    *   Compara la contraseña enviada con la encriptada en la base de datos.
4.  Si todo es correcto, devuelve un JSON con los datos del usuario (id, nombre, rol, avatar, número de empleado).

### Endpoint
*   **Método:** `POST`
*   **Ruta:** `/api/auth/login`
*   **Body esperado:**
    ```json
    {
      "numero_empleado": "EMP0001",
      "password": "admin321"
    }