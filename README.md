# Bar Don Juancho - Frontend

Sistema de gestión táctil multi-sede para bares y restaurantes.

## Tecnologias

- **Angular 19** con standalone components
- **TypeScript**
- **Bootstrap 5** (CSS base)
- **SCSS** para estilos personalizados
- **RxJS** para programación reactiva

## Arquitectura

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts          # Protección de rutas autenticadas
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Inyección automática de JWT
│   ├── services/
│   │   └── auth.service.ts       # Servicio centralizado de autenticación
│   ├── demo/
│   │   └── pages/
│   │       ├── login/            # Login y Registro de usuarios
│   │       └── dashboard/        # Panel principal
│   ├── app.config.ts              # Configuración de providers
│   └── app.routes.ts             # Rutas de la aplicación
```

## Funcionalidades Implementadas

### Épica 1: Arquitectura Base
- ✅ Setup del proyecto Angular
- ✅ Diseño responsive en español
- ✅ API Gateway con enrutamiento estático

### Épica 2: Autenticación y Servicio de Identidad
- ✅ Modelo estricto de roles (1=Admin Global, 2=Admin Local, 3=Cajero, 4=Mesero)
- ✅ Registro de usuarios administrativos
- ✅ Login con JWT (8 horas de expiración)
- ✅ Interceptor HTTP para inyección automática de token
- ✅ Auth Guard para protección de rutas
- ✅ Auto-cierre de sesión tras 5 minutos de inactividad

## Roles del Sistema

| ID | Rol | Descripción |
|----|-----|-------------|
| 1 | Admin Global | Acceso total al sistema (creado solo desde BD) |
| 2 | Admin Local | Administrador de sede específica |
| 3 | Cajero | Gestión de caja y cobros |
| 4 | Mesero | Toma de pedidos en mesas |

## Endpoints del API Gateway

| Ruta | Microservicio | Puerto |
|------|--------------|--------|
| `/api/auth/*` | service_master | 5001 |
| `/api/sedes/*` | service_master | 5002 |
| `/api/productos/*` | service_master | 5002 |

## Desarrollo

### Levantar el servidor de desarrollo
```bash
ng serve
```

Acceder a: `http://localhost:4200/`

### Levantar el backend (requisito previo)
```bash
# API Gateway
cd ../back/api_gateway && python app.py

# Service Master (en otra terminal)
cd ../back/service_master && python app.py
```

## Credenciales de Prueba

Después de crear un usuario Admin Global desde la base de datos:

```
Username: admin_principal
Password: (la que definas en BD)
Rol: Admin Global (1)
Sede: 1
```

## Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. API Gateway reenvía a `service_master:5001`
3. Backend valida y devuelve JWT
4. Frontend almacena token en `localStorage`
5. AuthInterceptor inyecta token en todas las peticiones
6. AuthGuard protege rutas que requieren autenticación

## Estructura de Datos

### Usuario (localStorage)
```json
{
  "id": 1,
  "username": "admin_principal",
  "rol": {
    "id": 1,
    "nombre": "Admin Global"
  },
  "sede_id": 1
}
```

### Token JWT (localStorage)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Criterios de Aceptación Verificados

- ✅ Login exitoso devuelve JWT
- ✅ Login fallido devuelve error 401
- ✅ Dashboard accesible solo con token válido
- ✅ Sesión se cierra tras 5 min exactos sin actividad
- ✅ Todas las textos en español
- ✅ Diseño responsive para pantallas táctiles