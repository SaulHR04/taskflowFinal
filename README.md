
#  Task Flow final

Una aplicación web SPA  para la gestion de proyectos, tareas Con Auth y alertas.

---
Credenciales para iniciar sesión:

**Pedir credenciales al creador del repositorio**

-----
**El Problema que resuelve**

- Permite gestionar de manera facil proyectos y tareas dentro de la organización. 
- Facilita el seguimiento en tiempo real del progreso de las actividades (Pendiente, En progreso, Completada).
- implementacion de JWT para el AUTH. 

**Tecnologías  y Librerías**
- React 18: Librería base para construir la interfaz.

- TypeScript

- Vite: Empaquetador y servidor de desarrollo.

- Material MUI y  Icons: Para los componentes visuales. 

- Axios: Cliente HTTP para la comunicación asíncrona con la API REST.

-------------------
## Estructura General de Carpetas

- **src/types.ts:** Contratos de datos (interfaces y tipos estrictos).

- **src/main.tsx/App.tsx** Puntos de entrada, configuración del enrutador y tema global.

- **src/context/:**  AuthContext para mantener la sesión viva.

- **src/components/:** Interfaz visual reutilizable 

- **src/services/:** Capa de red.

- src/hooks/: Custom hooks (useAuth, useProjects) para separar la lógica de negocio de la vista.

## Autenticación y Consumo de API
Login y JWT

- El flujo de autenticación es "stateless" es decir que no mantiene informacion. 

- El usuario envía credenciales en /login.

- El servidor valida y devuelve un token firmado.

   El token se guarda en localStorage (clave TASKFLOW_TOKEN).

**Interceptor de Axios:** Axio es el encargado de que se pueda tipar los datos de nuestros endpoints , previniendo errores.

Manejo de Rutas Protegidas
El componente <ProtectedRoute> funciona como guardián. Verifica el estado mediante el hook useAuth(). Si el usuario no está autenticado (token nulo), devuelve un componente <Navigate replace to="/login" /> que bloquea el acceso al dashboard y expulsa al usuario al login inmediatamente.

## Resumen del CRUD Implementado
- **GET:** Obtener proyectos (/projects) y tareas anidadas (/projects/{projectId}/tasks).

- **POST:** Crear un nuevo proyecto o una nueva tarea vinculada al ID del proyecto.

- **PUT:** Actualizar nombre/descripción de proyectos y tareas.

- **PATCH:** Actualizar el estado de la tarea. 

- **DELETE:** Borrar proyectos  y tareas individuales.

-----------------
