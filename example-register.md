# Ejemplos de uso del endpoint de registro

## Usando cURL

### Registro exitoso
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "email": "juan@example.com",
    "password": "mipassword123"
  }'
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "juan123",
    "email": "juan@example.com",
    "name": null
  }
}
```

### Error - Usuario duplicado
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "email": "juan@example.com",
    "password": "mipassword123"
  }'
```

**Respuesta de error:**
```json
{
  "message": "El nombre de usuario ya está en uso",
  "error": "Conflict",
  "statusCode": 409
}
```

### Error - Validación
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ana",
    "email": "email-invalido",
    "password": "123"
  }'
```

**Respuesta de error:**
```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Usando JavaScript/Fetch

### En el navegador o Node.js
```javascript
async function registrarUsuario() {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'maria456',
        email: 'maria@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Usuario registrado:', data);
      // Guardar el token
      localStorage.setItem('token', data.access_token);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}

// Llamar la función
registrarUsuario();
```

## Usando Postman

### Configuración
- **Método**: POST
- **URL**: `http://localhost:3000/auth/register`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "username": "carlos789",
  "email": "carlos@example.com",
  "password": "mypassword123"
}
```

## Usando Axios (React/Vue/Angular)

```javascript
import axios from 'axios';

const registrarUsuario = async (userData) => {
  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password
    });
    
    // Registro exitoso
    console.log('Usuario registrado:', response.data);
    
    // Guardar token en localStorage
    localStorage.setItem('auth_token', response.data.access_token);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error del servidor (409, 400, etc.)
      console.error('Error del servidor:', error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      // Error de red
      console.error('Error de red:', error.message);
      throw new Error('Error de conexión');
    }
  }
};

// Ejemplo de uso
const nuevoUsuario = {
  username: 'ana123',
  email: 'ana@example.com',
  password: 'password123'
};

registrarUsuario(nuevoUsuario)
  .then(data => {
    console.log('Registro exitoso:', data);
    // Redirigir a dashboard o página principal
  })
  .catch(error => {
    console.error('Error en el registro:', error.message);
    // Mostrar error al usuario
  });
```
