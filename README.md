Hola
# Bar Don Juancho - Frontend

Sistema de gestión táctil multi-sede para bares y restaurantes. Interfaz frontend desarrollada en Angular 19 para operación en pantallas táctiles.

![Angular](https://img.shields.io/badge/Angular-19.0.6-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=flat-square&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple?style=flat-square&logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Tecnologías](#tecnologías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Funcionalidades por Épica](#funcionalidades-por-épica)
5. [Sistema de Roles](#sistema-de-roles)
6. [Arquitectura de API](#arquitectura-de-api)
7. [Requisitos Previos](#requisitos-previos)
8. [Desarrollo Local](#desarrollo-local)
9. [Despliegue en Producción](#despliegue-en-producción)
10. [Flujo de Autenticación](#flujo-de-autenticación)
11. [Estructuras de Datos](#estructuras-de-datos)

---

## Visión General

**Bar Don Juancho** es un sistema de gestión integral para bares y restaurantes con las siguientes características:

- **Multi-sede**: Gestión simultánea de varias sedes (Norte, Centro, Sur)
- **Táctil**: Interfaz optimizada para pantallas táctiles
- **Multi-rol**: Sistema de permisos basado en roles (Admin Global, Admin Local, Cajero, Mesero)
- **Seguro**: Autenticación mediante JWT con vencimiento de 8 horas
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

---

## Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Angular | 19.0.6 | Framework principal |
| TypeScript | 5.6.2 | Lenguaje tipado |
| Bootstrap | 5.3.0 | Framework CSS base |
| SCSS | - | Estilos personalizados |
| RxJS | 7.8.0 | Programación reactiva |

---

## Estructura del Proyecto

```
Front-Dise-oAlgoritmos/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Componente raíz
│   │   ├── app.component.html        # Template raíz
│   │   ├── app.component.css         # Estilos raíz
│   │   ├── app.component.spec.ts    # Tests unitarios
│   │   ├── app.config.ts            # Configuración de providers
│   │   ├── app.routes.ts            # Definición de rutas
│   │   │
│   │   ├── demo/
│   │   │   └── pages/
│   │   │       ├── login/
│   │   │       │   ├── login.component.ts        # Componente de login/registro
│   │   │       │   ├── login.component.html      # Template
│   │   │       │   ├── login.component.scss      # Estilos
│   │   │       │   ├── login.component.spec.ts   # Tests
│   │   │       │   ├── login.service.ts          # Servicio de autenticación
│   │   │       │   ├── login.service.spec.ts     # Tests del servicio
│   │   │       │   └── models/
│   │   │       │       ├── login-rs.ts           # Modelo request/response login
│   │   │       │       └── respuesta-rs.ts       # Modelos de respuesta
│   │   │       │
│   │   │       ├── dashboard/
│   │   │       │   ├── dashboard.component.ts    # Panel principal
│   │   │       │   ├── dashboard.component.html  # Template
│   │   │       │   ├── dashboard.component.scss  # Estilos
│   │   │       │   └── dashboard.component.spec.ts
│   │   │       │
│   │   │       └── usuarios/
│   │   │           ├── usuarios.component.ts    # Gestión de usuarios
│   │   │           ├── usuarios.component.html    # Template
│   │   │           ├── usuarios.component.scss   # Estilos
│   │   │           └── usuarios.component.spec.ts
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Protección de rutas (CanActivate)
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Inyección automática de JWT en peticiones HTTP
│   │   │
│   │   └── services/
│   │       └── auth.service.ts       # Servicio centralizado de autenticación
│   │
│   ├── assets/                        # (vacío, reservado para recursos estáticos)
│   ├── index.html                     # HTML principal
│   ├── main.ts                        # Punto de entrada bootstrap
│   └── styles.css                     # Estilos globales
│
├── .vscode/
│   ├── extensions.json                # Extensiones recomendadas
│   ├── launch.json                    # Configuración de debug
│   └── tasks.json                    # Tareas predefinidas
│
├── dist/                              # Archivos compilados para producción
├── node_modules/                      # Dependencias instaladas
├── angular.json                       # Configuración de Angular CLI
├── package.json                       # Dependencias y scripts npm
├── package-lock.json                  # Lock file de dependencias
├── tsconfig.json                      # Configuración de TypeScript
├── tsconfig.app.json                  # TypeScript para aplicación
├── tsconfig.spec.json                 # TypeScript para tests
└── README.md                          # Este archivo
```

---

## Funcionalidades por Épica

### ÉPICA 1: Arquitectura Base y Seguridad

| HU | Descripción | Estado |
|----|-------------|--------|
| HU-001 | Setup del Frontend en Angular con Bootstrap | ✅ Completo |
| HU-002 | API Gateway y Enrutamiento Estático (Backend) | N/A |
| HU-003 | Arquitectura de Datos Descentralizada (Backend) | N/A |
| HU-004 | Encriptación y Seguridad Base (Backend) | N/A |

### ÉPICA 2: Autenticación y Servicio de Identidad

| HU | Descripción | Estado |
|----|-------------|--------|
| HU-005 | Modelo Estricto de Roles | ✅ Completo |
| HU-006 | Registro de Administradores | ✅ Completo |
| HU-007 | Login con Pruebas Unitarias y de Integración (Backend) | ✅ Completo |
| HU-008 | Cierre Automático de Sesión (5 min inactividad) | ✅ Completo |

---

## Sistema de Roles

| ID | Rol | Descripción | Permisos |
|----|-----|-------------|----------|
| 1 | Admin Global | Acceso total al sistema | Todos. Solo se crea desde BD |
| 2 | Admin Local | Administrador de sede específica | Gestión de usuarios de su sede |
| 3 | Cajero | Gestión de caja y cobros | Registro de pedidos y cobros |
| 4 | Mesero | Toma de pedidos en mesas | Registro de pedidos |

---

## Arquitectura de API

### Endpoints del API Gateway

| Ruta | Microservicio | Puerto | Descripción |
|------|---------------|--------|-------------|
| `/api/auth/login` | service_master | 5001 | Autenticación de usuarios |
| `/api/auth/registro` | service_master | 5001 | Registro de nuevos usuarios |
| `/api/auth/refresh` | service_master | 5001 | Renovación de tokens |
| `/api/auth/usuarios` | service_master | 5001 | Consulta de usuarios |
| `/api/sedes/*` | service_master | 5002 | Gestión de sedes |
| `/api/productos/*` | service_master | 5002 | Gestión de productos |

### Flujo de Comunicación

```
[Angular] → [API Gateway :8000] → [service_master :5001/5002]
```

---

## Requisitos Previos

### Software necesario

| Software | Versión mínima | Propósito |
|----------|----------------|-----------|
| Node.js | 18.x o superior | Entorno de ejecución |
| npm | 9.x o superior | Gestor de paquetes |
| Angular CLI | 19.0.x | CLI de Angular |

### Backend requerido

El frontend necesita que el backend esté corriendo para funcionar. Verificar que los siguientes servicios estén activos:

1. **API Gateway** (puerto 8000)
2. **Service Master** (puertos 5001/5002)

---

## Desarrollo Local

### 1. Instalación de dependencias

```bash
npm install
```

### 2. Levantar el servidor de desarrollo

```bash
ng serve
```

El frontend estará disponible en: `http://localhost:4200/`

### 3. Configurar el Backend (requisito previo)

```bash
# Terminal 1: API Gateway
cd ../back/api_gateway
python app.py

# Terminal 2: Service Master
cd ../back/service_master
python app.py
```

### 4. Credenciales de prueba

Para probar el sistema, crear un usuario Admin Global directamente en la base de datos:

```
username: admin_principal
password: (definida por ti en la BD)
rol_id: 1 (Admin Global)
sede_id: 1 (cualquiera)
```

---

## Despliegue en Producción

### Paso 1: Build de producción

```bash
ng build --configuration production
```

Esto genera los archivos optimizados en la carpeta `dist/front/`.

### Paso 2: Servir archivos estáticos

Los archivos en `dist/front/browser/` pueden servirse con cualquier servidor web:

#### Opción A: Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /path/a/dist/front/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
    }
}
```

#### Opción B: Apache (.htaccess)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Opción C: Python http.server

```bash
cd dist/front/browser
python -m http.server 8080
```

### Paso 3: Configurar variables de producción

Si el API Gateway está en un dominio diferente, actualizar la URL en:

**Archivo:** `src/app/services/auth.service.ts` línea 11

```typescript
private apiUrl = 'https://tu-dominio.com/api/auth';
```

### Paso 4: HTTPS (obligatorio)

El sistema requiere HTTPS para funcionamiento seguro. Configurar certificado SSL:

- Let's Encrypt (gratuito)
- Certificados comerciales

---

## Flujo de Autenticación

```
1. Usuario abre /login
2. Ingresa username y password
3. Angular envía POST a /api/auth/login
4. API Gateway reenvía a service_master:5001
5. Backend valida credenciales contra BD
6. Backend genera JWT (8h expiración)
7. Frontend recibe { token, refresh_token, usuario }
8. Tokens almacenados en localStorage:
   - token
   - refresh_token
   - usuario (JSON)
9. AuthInterceptor inyecta "Authorization: Bearer {token}"
10. AuthGuard valida token en cada navegación a rutas protegidas
11. Si token expira → AuthInterceptor llama /refresh
12. Si refresh falla → Redirige a /login
```

---

## Estructuras de Datos

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

### Token Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expira_en": "8h",
  "usuario": { ... }
}
```

### Headers de autenticación

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Comandos Rápidos

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `ng serve` | Levantar servidor desarrollo (:4200) |
| `ng build` | Build de producción |
| `ng build --configuration production` | Build optimizado |
| `ng test` | Ejecutar tests unitarios |
| `ng build --watch --configuration development` | Build con watch para desarrollo |

---

## Notas de Desarrollo

- Los componentes usan **standalone components** (sin módulos tradicionales)
- Bootstrap se importa globalmente desde `node_modules`
- SCSS para estilos con variables y mixins
- RxJS para manejo reactivo de peticiones HTTP

---

## Licencia

MIT