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
4. [Sistema de Diseño](#sistema-de-diseño)
5. [Funcionalidades por Épica](#funcionalidades-por-épica)
6. [Arquitectura de Páginas](#arquitectura-de-páginas)
7. [Sistema de Roles](#sistema-de-roles)
8. [Arquitectura de API](#arquitectura-de-api)
9. [Requisitos Previos](#requisitos-previos)
10. [Desarrollo Local](#desarrollo-local)
11. [Flujo de Autenticación](#flujo-de-autenticación)
12. [Estructuras de Datos](#estructuras-de-datos)

---

## Visión General

**Bar Don Juancho** es un sistema de gestión integral para bares y restaurantes con las siguientes características:

- **Multi-sede**: Gestión simultánea de varias sedes (Norte, Centro, Sur)
- **Táctil**: Interfaz optimizada para pantallas táctiles
- **Multi-rol**: Sistema de permisos basado en roles (Admin Global, Admin Local, Cajero, Mesero)
- **Seguro**: Autenticación mediante JWT con vencimiento de 8 horas
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Tema Oscuro/Luz**: Soporte nativo para cambio de tema día/noche

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
│   │   ├── app.config.ts            # Configuración de providers
│   │   ├── app.routes.ts            # Definición de rutas
│   │   │
│   │   ├── demo/
│   │   │   └── pages/
│   │   │       ├── login/           # Página de login
│   │   │       ├── dashboard/       # Panel principal (Home)
│   │   │       ├── usuarios/        # Gestión de usuarios
│   │   │       ├── sedes/           # Gestión de sedes
│   │   │       ├── productos/       # Gestión de productos
│   │   │       └── inventario/      # Gestión de inventario
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts        # Protección de rutas
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Inyección automática de JWT
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts      # Servicio de autenticación
│   │   │   ├── sede.service.ts      # Servicio de sedes
│   │   │   ├── producto.service.ts  # Servicio de productos
│   │   │   ├── inventario.service.ts # Servicio de inventario
│   │   │   └── theme.service.ts    # Servicio de tema (oscuro/luz)
│   │   │
│   │   └── shared/
│   │       └── components/
│   │           └── theme-toggle/    # Botón selector de tema
│   │
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.css                   # Variables globales de tema
│
├── dist/                            # Archivos compilados
├── node_modules/
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## Sistema de Diseño

### Paleta de Colores

El sistema utiliza variables CSS que cambian según el tema activo (oscuro/luz).

#### Modo Noche (Dark)

| Variable | Hex | Uso |
|----------|-----|-----|
| `--bg-base` | `#0F1117` | Fondo principal |
| `--bg-surface` | `#171C28` | Cards y contenedores |
| `--bg-elevated` | `#1E2638` | Elementos elevados |
| `--border` | `#2B3A5C` | Bordes y divisores |
| `--primary` | `#4A6FD4` | Botones primarios |
| `--accent` | `#7B96F5` | Acentos y hover |
| `--text-primary` | `#C8D4FF` | Texto principal |
| `--text-secondary` | `#8892B0` | Texto secundario |

#### Modo Día (Light)

| Variable | Hex | Uso |
|----------|-----|-----|
| `--bg-base` | `#EDF0FA` | Fondo principal |
| `--bg-surface` | `#FAFBFF` | Cards y contenedores |
| `--bg-elevated` | `#FFFFFF` | Elementos elevados |
| `--border` | `#DDE3F5` | Bordes y divisores |
| `--primary` | `#4A6FD4` | Botones primarios |
| `--accent` | `#7B96F5` | Acentos y hover |
| `--text-primary` | `#1E1E5D` | Texto principal |
| `--text-secondary` | `#445085` | Texto secundario |

> **Nota**: `--primary` y `--accent` son idénticos en ambos temas para mantener consistencia visual.

### Sistema de Componentes

Todos los componentes de gestión comparten la misma estructura visual:

#### Header de Página
```html
<div class="page-header">
  <button class="back-button" (click)="volverAlDashboard()">
    <span>←</span> Back
  </button>
  <h1>Título de la Página</h1>
  <div class="header-actions">
    <app-theme-toggle></app-theme-toggle>
  </div>
</div>
```

#### Card de Contenido
```html
<div class="content-card">
  <div class="card-header">
    <h2>Subtítulo</h2>
    <button class="btn-primary">+ Nueva Acción</button>
  </div>
  <!-- Contenido: tabla, lista, etc -->
</div>
```

#### Modal Estándar
```html
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Título del Modal</h3>
      <button class="close-button">×</button>
    </div>
    <div class="modal-body">
      <!-- Formularios -->
    </div>
    <div class="modal-actions">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Save</button>
    </div>
  </div>
</div>
```

### Clases de Estilos Comunes

| Clase | Descripción |
|-------|-------------|
| `.page-header` | Header con botón back, título y acciones |
| `.back-button` | Botón para volver al dashboard (← Back) |
| `.content-card` | Contenedor principal de contenido |
| `.card-header` | Header dentro de card con título y acciones |
| `.btn-primary` | Botón principal (fondo primary, texto blanco) |
| `.btn-secondary` | Botón secundario (borde, fondo elevado) |
| `.data-table` | Tabla de datos con estilos de tema |
| `.modal-overlay` | Overlay semitransparente para modales |
| `.modal-content` | Contenedor del modal |
| `.error-message` | Mensaje de error con borde rojo |
| `.success-message` | Mensaje de éxito con borde verde |
| `.empty-state` | Estado cuando no hay datos |

---

## Funcionalidades por Épica

### ÉPICA 1: Arquitectura Base y Seguridad (Sprint 1)

| HU | Descripción | Estado |
|----|-------------|--------|
| HU-001 | Setup del Frontend en Angular con Bootstrap | ✅ Completo |
| HU-002 | API Gateway y Enrutamiento Estático | ✅ Completo (Backend) |
| HU-003 | Arquitectura de Datos Descentralizada | ✅ Completo (Backend) |
| HU-004 | Encriptación y Seguridad Base | ✅ Completo (Backend) |

### ÉPICA 2: Autenticación y Servicio de Identidad (Sprint 2)

| HU | Descripción | Estado |
|----|-------------|--------|
| HU-005 | Modelo Estricto de Roles | ✅ Completo (Backend) |
| HU-006 | Registro de Administradores | ✅ Completo |
| HU-007 | Login con Pruebas Unitarias | ✅ Completo (Backend) |
| HU-008 | Cierre Automático de Sesión (5 min) | ✅ Completo |

### ÉPICA 3: Administración y Catálogo Global (Sprint 3)

| HU | Descripción | Estado |
|----|-------------|--------|
| HU-009 | CRUD de Sedes Físicas | ✅ Completo |
| HU-010 | Control de Acceso por Sede | ✅ Completo |
| HU-011 | Maestra de Productos Centralizada | ✅ Completo (Backend) |
| HU-012 | UI de Catálogo de Productos | ✅ Completo |

### ÉPICA 4: Microservicio de Inventario (Sprint 4)

| HU | Descripción | Estado |
|----|-------------|--------|
| HU-013 | Restricción de Unidades Enteras | ✅ Completo (Backend) |
| HU-014 | Asignación Inicial de Stock | ✅ Completo |
| HU-015 | Vista de Inventario por Sede | ✅ Completo |
| HU-016 | Ingreso Manual de Stock | ✅ Completo |
| HU-017 | Salida Manual de Stock (Mermas) | ✅ Completo |
| HU-018 | Historial Básico de Movimientos | ✅ Completo |

---

## Arquitectura de Páginas

### Página: Login (`/login`)

**Archivo:** `src/app/demo/pages/login/`

**Funcionalidad:**
- Formulario de login con username y password
- Almacenamiento de JWT en localStorage
- Redirección a `/dashboard` tras login exitoso
- Auto-logout tras 5 minutos de inactividad

**Componentes:**
- `login.component.ts` - Lógica del componente
- `login.service.ts` - Servicio de autenticación
- `login-rs.ts`, `respuesta-rs.ts` - Modelos de respuesta

---

### Página: Home (`/dashboard`)

**Archivo:** `src/app/demo/pages/dashboard/`

**Funcionalidad:**
- Panel principal con botones de navegación
- Muestra nombre de usuario y rol
- Botón de logout
- Toggle de tema (oscuro/luz)
- Círculos decorativos animados con tema

**Rutas accesibles desde Home:**
- `/productos` - Gestión de productos
- `/usuarios` - Gestión de usuarios
- `/sedes` - Gestión de sedes
- `/inventario` - Gestión de inventario

---

### Página: Usuarios (`/usuarios`)

**Archivo:** `src/app/demo/pages/usuarios/`

**Funcionalidad:**
- Lista todos los usuarios del sistema
- Modal para registrar nuevo usuario
- Badges de colores según rol
- Botón "← Back" para volver al home

**Modelo de datos:**
```typescript
interface Usuario {
  id: number;
  username: string;
  rol: { id: number; nombre: string };
  sede_id: number;
  creado_en: string;
}
```

---

### Página: Sedes (`/sedes`)

**Archivo:** `src/app/demo/pages/sedes/`

**Funcionalidad:**
- Lista todas las sedes
- Modal para crear nueva sede (nombre, dirección, teléfono)
- Botón "← Back" para volver al home

**Modelo de datos:**
```typescript
interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}
```

---

### Página: Productos (`/productos`)

**Archivo:** `src/app/demo/pages/productos/`

**Funcionalidad:**
- Lista todos los productos activos
- Modal para crear nuevo producto (nombre, precio, categoría)
- Badges de estado (Active/Inactive)
- Formateo de precios

**Modelo de datos:**
```typescript
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  activo: boolean;
}
```

---

### Página: Inventario (`/inventario`)

**Archivo:** `src/app/demo/pages/inventario/`

**Funcionalidad:**
- Selector de sede para filtrar inventario
- Tabla de stock con indicadores de stock bajo (< 5)
- **Modal de Ingreso**: Registrar entrada de mercancía
  - Selecciona producto
  - Ingresa cantidad (enteros positivos)
  - Observación opcional
- **Modal de Merma**: Registrar salida de mercancía
  - Selecciona producto (muestra stock actual)
  - Ingresa cantidad
  - Observación opcional
- **Modal de Historial**: Ver movimientos registrados
  - Fecha, tipo (In/Out), cantidad, observación

**Endpoints utilizados:**
- `GET /api/inventario/sede/<sede_id>` - Obtener stock
- `POST /api/inventario/movimiento` - Registrar movimiento

**Modelo de datos:**
```typescript
interface Inventario {
  id: number;
  sede_id: number;
  producto_id: number;
  cantidad: number;
  movimientos?: MovimientoInventario[];
}

interface MovimientoInventario {
  id: number;
  tipo_movimiento: 'INGRESO' | 'MERMA';
  cantidad: number;
  fecha: string;
  observacion: string;
}

interface MovimientoRequest {
  sede_id: number;
  producto_id: number;
  tipo_movimiento: 'INGRESO' | 'MERMA';
  cantidad: number;
  observacion?: string;
}
```

---

## Sistema de Roles

| ID | Rol | Descripción | Permisos |
|----|-----|-------------|----------|
| 1 | Admin Global | Acceso total al sistema | Gestión de todas las sedes, usuarios y productos |
| 2 | Admin Local | Administrador de sede específica | Gestión de usuarios de su sede, inventario |
| 3 | Cajero | Gestión de caja y cobros | Registro de pedidos y cobros |
| 4 | Mesero | Toma de pedidos en mesas | Registro de pedidos |

---

## Arquitectura de API

### API Gateway (Puerto 8000)

Todas las peticiones del frontend pasan por el API Gateway que las redirige a los microservicios correspondientes.

```
[Angular] → [API Gateway :8000] → [Microservicios]
```

### Endpoints

| Ruta | Microservicio | Puerto | Métodos |
|------|---------------|--------|---------|
| `/api/auth/*` | service_master | 5001 | POST login, registro, refresh, GET usuarios |
| `/api/sedes/*` | catalog_service | 5002 | GET, POST sedes |
| `/api/productos/*` | catalog_service | 5002 | GET, POST productos |
| `/api/inventario/*` | inventory_service | 5003 | GET stock, POST movimientos |

### Microservicios

| Servicio | Puerto | Base de Datos | Propósito |
|----------|--------|---------------|-----------|
| service_master | 5001 | bar_identity_db | Autenticación y usuarios |
| catalog_service | 5002 | bar_catalog_db | Sedes y productos |
| inventory_service | 5003 | bar_inventory_db | Inventario y movimientos |

---

## Requisitos Previos

### Software necesario

| Software | Versión mínima | Propósito |
|----------|----------------|-----------|
| Node.js | 18.x | Entorno de ejecución |
| npm | 9.x | Gestor de paquetes |
| Angular CLI | 19.0.x | CLI de Angular |

### Backend requerido

Para que el frontend funcione, estos servicios deben estar activos:

1. **API Gateway** - Puerto 8000 (punto de entrada)
2. **Service Master** - Puerto 5001 (autenticación)
3. **Catalog Service** - Puerto 5002 (sedes, productos)
4. **Inventory Service** - Puerto 5003 (inventario)

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

Acceso: `http://localhost:4200/`

### 3. Levantar el Backend

```bash
# Terminal 1: API Gateway
cd ../back/api_gateway && python app.py

# Terminal 2: Service Master
cd ../back/service_master && python app.py

# Terminal 3: Catalog Service
cd ../back/catalog_service && python app.py

# Terminal 4: Inventory Service
cd ../back/inventory_service && python app.py
```

### 4. Credenciales de prueba

Crear un usuario Admin Global directamente en la base de datos:

```
username: admin_principal
password: (definida en la BD, debe estar hasheada con bcrypt)
rol_id: 1 (Admin Global)
sede_id: 1 (cualquiera)
```

---

## Flujo de Autenticación

```
1. Usuario abre /login
2. Ingresa username y password
3. Angular envía POST /api/auth/login
4. API Gateway redirige a service_master:5001
5. Backend valida credenciales
6. Backend genera JWT (8h expiración) + refresh token (7 días)
7. Frontend recibe { token, refresh_token, usuario }
8. Tokens almacenados en localStorage:
   - token
   - refresh_token
   - usuario (JSON)
9. AuthInterceptor inyecta header en cada petición:
   Authorization: Bearer {token}
10. AuthGuard valida token en cada navegación a rutas protegidas
11. Si token expira → AuthInterceptor llama /api/auth/refresh
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

### Login Request

```json
{
  "username": "admin_principal",
  "password": "mi_password"
}
```

### Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expira_en": "8h",
  "usuario": {
    "id": 1,
    "username": "admin_principal",
    "rol": { "id": 1, "nombre": "Admin Global" },
    "sede_id": 1
  }
}
```

### Movimiento de Inventario (Request)

```json
{
  "sede_id": 1,
  "producto_id": 1,
  "tipo_movimiento": "INGRESO",
  "cantidad": 10,
  "observacion": "Carga inicial"
}
```

---

## Comandos Rápidos

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `ng serve` | Servidor desarrollo (:4200) |
| `ng build` | Build desarrollo |
| `ng build --configuration production` | Build producción |
| `ng test` | Tests unitarios |

---

## Notas de Desarrollo

- **Standalone Components**: Todos los componentes son standalone (sin módulos tradicionales)
- **Theme Toggle**: El cambio de tema se almacena en localStorage (`app-theme`)
- **Transiciones**: Las transiciones de tema usan `0.4s ease` para suavidad visual
- **Auth Guard**: Todas las rutas excepto `/login` están protegidas
- **Auth Interceptor**: Agrega automáticamente el JWT a todas las peticiones HTTP
- **Inactividad**: El logout por inactividad se calcula con HostListener sobre eventos de usuario

---

## Licencia

MIT