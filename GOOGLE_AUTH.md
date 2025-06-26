# Google OAuth2 Integration

Esta implementación permite autenticación con Google usando Google Sign-In (GSI) client en el frontend.

## Configuración

### 1. Variables de Entorno

Crear un archivo `.env` basado en `.env.example` con las siguientes variables:

```env
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 2. Configuración en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google Sign-In API
4. Crea credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - Orígenes JavaScript autorizados: `http://localhost:3000` (frontend)
   - URIs de redirección autorizados: No necesarios para GSI

### 3. Configuración del Frontend

En tu frontend, integra Google Sign-In usando GSI:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

```javascript
// Inicializar Google Sign-In
google.accounts.id.initialize({
  client_id: 'TU-GOOGLE-CLIENT-ID.apps.googleusercontent.com',
  callback: handleCredentialResponse
});

// Renderizar botón
google.accounts.id.renderButton(
  document.getElementById('google-signin-button'),
  { theme: 'outline', size: 'large' }
);

// Manejar respuesta
function handleCredentialResponse(response) {
  // Enviar el token al backend
  fetch('http://localhost:3000/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: response.credential
    })
  })
  .then(response => response.json())
  .then(data => {
    // Guardar token JWT
    localStorage.setItem('access_token', data.access_token);
    // Redirigir o actualizar UI
    console.log('Usuario autenticado:', data.user);
  });
}
```

## Endpoints de la API

### POST /auth/google

Autentica un usuario usando un token ID de Google.

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

## Flujo de Autenticación

1. El usuario hace clic en "Sign in with Google" en el frontend
2. Google GSI muestra la ventana de autenticación
3. El usuario se autentica con Google
4. Google devuelve un token ID al frontend
5. El frontend envía el token ID al endpoint `/auth/google`
6. El backend verifica el token con Google
7. Si es válido, busca o crea el usuario en la base de datos
8. El backend devuelve un JWT token y la información del usuario
9. El frontend guarda el JWT token para futuras peticiones

## Características

- ✅ Verificación segura del token ID con Google
- ✅ Creación automática de usuarios nuevos
- ✅ Vinculación de cuentas existentes por email
- ✅ Actualización de información del perfil de Google
- ✅ Compatible con autenticación tradicional (username/password)
- ✅ Información del usuario incluyendo foto de perfil

## Base de Datos

La entidad User se ha extendido con los siguientes campos:

- `email`: Email del usuario (único)
- `googleId`: ID único de Google (nullable)
- `name`: Nombre completo del usuario (nullable)
- `picture`: URL de la foto de perfil (nullable)
- `emailVerified`: Si el email está verificado por Google
- `password`: Ahora es nullable para usuarios de Google

## Seguridad

- Los tokens ID de Google se verifican usando la librería oficial de Google
- Los JWT tokens incluyen información adicional del usuario
- Los usuarios de Google no necesitan password
- Se mantiene compatibilidad con autenticación tradicional
