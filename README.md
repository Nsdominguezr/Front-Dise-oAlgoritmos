# Bar Don Juancho - Frontend

**Sistema de gestión táctil multi-sede para bares y restaurantes**

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Requisitos e Instalación](#requisitos-e-instalación)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Sistema de Rutas y Guards](#sistema-de-rutas-y-guards)
7. [Servicios y Comunicación con el Backend](#servicios-y-comunicación-con-el-backend)
8. [Sistema de Temas (Dark/Light)](#sistema-de-temas-darklight)
9. [Guía de Componentes](#guía-de-componentes)
10. [Modelos de Datos](#modelos-de-datos)
11. [Comandos útiles](#comandos-útiles)
12. [Solución de Problemas](#solución-de-problemas)

---

## Descripción General

**Bar Don Juancho** es una aplicación web Angular diseñada para gestionar bares/restaurantes con múltiples sedes. Permite administrar usuarios, productos, inventario, pedidos y cobros de forma táctil.

### Características Principales

- **Modo Oscuro/Claro**: Cambio instantáneo de tema con persistencia en localStorage
- **Sistema de Roles**: 4 tipos de usuarios con permisos diferenciados
- **Autenticación JWT**: Tokens con refresh automático
- **Arquitectura de Microservicios**: 5 servicios backend separados
- **Responsive**: Diseñado para pantallas táctiles (tablets/pantallas grandes)

---

## Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Angular)                              │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Login     │───▶│ Dashboard   │───▶│  Módulos    │───▶│   Services │    │
│  │  (Público)  │    │  (Protegido)│    │  (RoleGuard)│    │  (HTTP)    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘    │
│                                                                    │           │
│  ┌─────────────────────────────────────────────────────────────┐  │           │
│  │                    AuthInterceptor                           │◀─┘           │
│  │  • Adjunta JWT a cada petición                               │              │
│  │  • Maneja 401 con refresh token automático                   │              │
│  └─────────────────────────────────────────────────────────────┘              │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ HTTPS (puerto 8000)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY (Puerto 8000)                         │
│                        Routing basado en prefijo /api/*                      │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌─────────────────┐          ┌─────────────────┐
│ Auth Service  │          │ Catalog Service │          │Order Service    │
│  (Puerto 5001)│          │  (Puerto 5002)  │          │ (Puerto 5004)   │
│               │          │                 │          │                 │
│ • /api/auth/* │          │ • /api/sedes/* │          │ • /api/pedidos/*│
│ • Login       │          │ • /api/productos│          │ • /api/caja/*   │
│ • Registro    │          │ • /api/inventario│         │                 │
│ • Usuarios   │          │                 │          │                 │
└───────────────┘          └─────────────────┘          └─────────────────┘
```

### Ports del Backend

| Puerto | Servicio | Responsabilidad |
|--------|----------|----------------|
| 8000 | API Gateway | Recibe todas las peticiones, las rutea al servicio correspondiente |
| 5001 | Auth Service | Login, logout, registro de usuarios, refresh tokens |
| 5002 | Catalog Service | Sedes, productos, categorías |
| 5003 | Inventory Service | Stock, movimientos de inventario |
| 5004 | Orders Service | Pedidos, caja, cobros |

---

## Requisitos e Instalación

### Software Requerido

- **Node.js 18+** con npm 9+
- **Angular CLI 17+**
- Backend ejecutándose en los puertos mencionados

### Instalación

```bash
# 1. Entrar al directorio del proyecto
cd /home/user/Documentos/Diseño\ de\ algoritmos/Front/Front-Dise-oAlgoritmos

# 2. Instalar dependencias
npm install

# 3. Asegurarse que el backend esté corriendo (5 terminales)
# Terminal 1: API Gateway (8000)
# Terminal 2: Auth Service (5001)
# Terminal 3: Catalog Service (5002)
# Terminal 4: Inventory Service (5003)
# Terminal 5: Orders Service (5004)

# 4. Levantar el frontend
ng serve
```

La aplicación estará disponible en: **`http://localhost:4200`**

---

## Flujo de Autenticación

### Proceso de Login

```
1. Usuario ingresa credenciales en /login
2. LoginComponent llama a AuthService.login(username, password)
3. AuthService hace POST a /api/auth/login
4. Backend valida y retorna:
   {
     "token": "eyJ...",
     "refresh_token": "eyJ...",
     "expira_en": "2026-06-27T00:00:00Z",
     "usuario": { "id": 1, "nombre": "...", "rol": "Admin Global", "sede_id": null }
   }
5. AuthService.guardarTokens() almacena en localStorage:
   - token
   - refresh_token
   - usuario (JSON stringified)
6. Redirección a /dashboard
```

### Proceso de Request con JWT

```
1. Cualquier HTTP request pasa por AuthInterceptor
2. Interceptor adjunta header: Authorization: Bearer <token>
3. Backend valida token
4. Si es válido → procesa request
5. Si expira (401) → interceptor llama refreshToken()
6. Refresh成功后 → reintenta request original con nuevo token
7. Si refresh falla → redirige a /login
```

### Decodificación del Token JWT

El payload del token contiene:
```json
{
  "user_id": 1,
  "username": "admin",
  "rol": "Admin Global",
  "sede_id": null,
  "exp": 1751068800,
  "iat": 1750982400
}
```

**Nota**: `sede_id` es `null` para Admin Global, pero tiene un valor para Admin Local, Mesero y Cajero.

---

## Estructura del Proyecto

```
Front-Dise-oAlgoritmos/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Root component
│   │   ├── app.config.ts             # Configuración de providers (HTTP, routes)
│   │   ├── app.routes.ts             # Definición de todas las rutas
│   │   │
│   │   ├── demo/
│   │   │   └── pages/                # Todos los módulos/páginas
│   │   │       ├── login/            # Login (público)
│   │   │       │   ├── login.component.ts
│   │   │       │   ├── login.component.html
│   │   │       │   ├── login.component.scss
│   │   │       │   ├── login.component.spec.ts
│   │   │       │   ├── models/
│   │   │       │   │   ├── login-rs.ts    # Modelos request/response login
│   │   │       │   │   └── respuesta-rs.ts
│   │   │       │   └── service/
│   │   │       │       └── login.service.ts
│   │   │       │
│   │   │       ├── dashboard/        # Home principal post-login
│   │   │       │
│   │   │       ├── usuarios/         # CRUD usuarios (Admin Global)
│   │   │       ├── sedes/           # CRUD sedes (Admin Global)
│   │   │       ├── productos/        # CRUD productos (Admin Global)
│   │   │       ├── inventario/       # Gestión stock (Admin Global, Admin Local)
│   │   │       ├── pedido/           # Tomar pedidos (Admin Global, Mesero)
│   │   │       ├── caja/            # Cobrar pedidos (Admin Global, Cajero)
│   │   │       ├── mesas/            # Gestión mesas (Admin Global, Admin Local)
│   │   │       ├── historial/        # Historial de pagos (Admin Global, Cajero)
│   │   │       └── reportes/         # Reportes (Admin Global, Admin Local)
│   │   │
│   │   ├── services/                 # Servicios shared (globales)
│   │   │   ├── auth.service.ts       # Autenticación y gestión de tokens
│   │   │   ├── theme.service.ts      # Cambio de tema (dark/light)
│   │   │   ├── producto.service.ts   # CRUD productos
│   │   │   ├── sede.service.ts       # CRUD sedes
│   │   │   ├── inventario.service.ts  # Stock y movimientos
│   │   │   ├── mesa.service.ts       # Gestión de mesas
│   │   │   └── reportes.service.ts    # Historial de pagos
│   │   │
│   │   ├── guards/                   # Protectores de rutas
│   │   │   ├── auth.guard.ts         # ¿Está autenticado?
│   │   │   └── role.guard.ts         # ¿Tiene el rol correcto?
│   │   │
│   │   ├── interceptors/             # Interceptores HTTP
│   │   │   └── auth.interceptor.ts   # Adjunta JWT + maneja 401
│   │   │
│   │   └── shared/                   # Componentes reutilizables
│   │       └── components/
│   │           └── theme-toggle/     # Botón toggle dark/light
│   │
│   ├── styles.css                    # Variables CSS globales + reset
│   └── index.html
│
├── dist/                            # Build de producción
├── node_modules/                    # Dependencias npm
└── angular.json                    # Configuración Angular CLI
```

---

## Sistema de Rutas y Guards

### Definición de Rutas (app.routes.ts)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },  // Público

  // Rutas protegidas por AuthGuard (verifica token válido)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Rutas protegidas por AuthGuard + RoleGuard (verifica rol)
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global'] }
  },
  // ... más rutas
];
```

### Flujo de Guards

```
Solicitud de navegación a /usuarios
         │
         ▼
┌─────────────────┐
│   AuthGuard     │ ── ¿Token existe y no ha expirado?
│                 │
│  canActivate()  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ SÍ / NO │
    └────┬────┘
         │
    ┌────┴────┐
    ▼         ▼
  continue  redirect
            to /login
         │
         ▼
┌─────────────────┐
│   RoleGuard     │ ── ¿Rol del usuario está en lista de roles permitidos?
│                 │
│  canActivate()  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ SÍ / NO │
    └────┬────┘
         │
    ┌────┴────┐
    ▼         ▼
  continue  redirect
            to /dashboard
```

### Roles y Permisos

| Rol | Login | Dashboard | Usuarios | Sedes | Productos | Inventario | Pedido | Caja | Mesas | Historial | Reportes |
|-----|-------|----------|----------|-------|-----------|------------|--------|------|-------|-----------|----------|
| Admin Global | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin Local | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Mesero | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cajero | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |

---

## Servicios y Comunicación con el Backend

### Patrón de Servicio

Cada servicio Angular:
1. Usa `HttpClient` para hacer peticiones HTTP
2. Incluye el token JWT en los headers via `AuthInterceptor`
3. Retorna `Observable<T>` para manejo asíncrono
4. Se injecta via Dependency Injection en los componentes

### Servicios Principales

#### AuthService (`auth.service.ts`)

Gestiona toda la autenticación:

```typescript
// Login
login(username: string, password: string): Observable<RespuestaLogin>

// Registro de usuario
registro(credentials: LoginRequest): Observable<RespuestaLogin>

// Obtener usuarios (Admin Global)
obtenerUsuarios(): Observable<RespuestaUsuarios>

// Refresh token
refreshToken(): Observable<any>

// Gestión de tokens (localStorage)
guardarTokens(token, refreshToken, usuario)
actualizarToken(nuevoToken, expiraEn, usuario)
getToken(): string | null
isAuthenticated(): boolean

// info del usuario
getUserId(): number | null
getSedeId(): number | null      // Null para Admin Global
getRol(): string | null
getUsuario(): any | null

// Helpers de rol
esAdminGlobal(): boolean
esAdminLocal(): boolean
esCajero(): boolean
esMesero(): boolean

// Desactivar usuario (soft delete)
desactivarUsuario(usuarioId): Observable<any>
```

#### ThemeService (`theme.service.ts`)

Sistema de temas simple con BehaviorSubject:

```typescript
// Estado reactivo del tema actual
theme$: Observable<Theme>        // 'dark' | 'light'
currentTheme: Theme              // getter sincrono

// Cambiar tema
toggleTheme(): void
setTheme(theme: Theme): void

// Persistencia en localStorage (key: 'app-theme')
// Default: 'dark'
```

**Importante**: El tema se aplica via `document.documentElement.setAttribute('data-theme', theme)` y las CSS variables detectan este atributo.

#### PedidoService (`pedido/service/pedido.service.ts`)

Gestión de pedidos (HU-019 a HU-025):

```typescript
// Obtener mesas de una sede
obtenerMesas(sedeId: number): Observable<Mesa[]>

// Abrir nuevo pedido
abrirPedido(request: AbrirPedidoRequest): Observable<PedidoResponse>

// Agregar ítem a pedido
agregarItem(pedidoId: number, request: AgregarItemRequest): Observable<PedidoResponse>

// Pasar pedido a caja (listo para cobrar)
pasarACaja(pedidoId: number): Observable<PedidoResponse>

// Obtener pedido con detalles
obtenerPedido(pedidoId: number): Observable<any>

// Obtener pedidos abiertos (para caja)
obtenerPedidosAbiertos(sedeId: number): Observable<Pedido[]>
```

#### CajaService (`caja/service/caja.service.ts`)

Cobro de pedidos (HU-026 a HU-029):

```typescript
// Obtener pedidos pendientes de pago
obtenerPendientes(sedeId: number): Observable<PedidoCaja[]>

// Obtener detalle de pedido para cobrar
obtenerDetallePedido(pedidoId: number): Observable<PedidoCajaDetalle>

// Procesar pago (checkout)
procesarCheckout(pedidoId: number, request: CheckoutRequest): Observable<CheckoutResponse>
```

### Interceptor de Autenticación

```typescript
// AuthInterceptor adjunta JWT a toda petición
intercept(req, next): Observable<HttpEvent<any>> {
  // Skip para /login y /refresh
  if (req.url.includes('/refresh') || req.url.includes('/login')) {
    return next.handle(req);
  }

  // Adjunta token
  const cloned = req.clone({
    setHeaders: { 'Authorization': `Bearer ${token}` }
  });

  // Maneja 401 (token expirado)
  return next.handle(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        return this.handleUnauthorized(req, next);
      }
      return throwError(() => err);
    })
  );
}
```

---

## Sistema de Temas (Dark/Light)

### Implementación

El sistema usa **CSS Custom Properties** (variables) definidas en `styles.css`:

```css
:root,
[data-theme="dark"] {
  --bg-base: #0F1117;
  --bg-surface: #171C28;
  --bg-elevated: #1E2638;
  --border: #2B3A5C;
  --primary: #4A6FD4;
  --accent: #7B96F5;
  --text-primary: #C8D4FF;
  --text-secondary: #8892B0;
  --success: #27ae60;
  --danger: #e94560;
  --warning: #f39c12;
  --info: #3498db;
}

[data-theme="light"] {
  --bg-base: #EDF0FA;
  --bg-surface: #FAFBFF;
  --bg-elevated: #FFFFFF;
  --border: #DDE3F5;
  --primary: #4A6FD4;       /* Mismo color */
  --accent: #7B96F5;        /* Mismo color */
  --text-primary: #1E1E5D;
  --text-secondary: #445085;
  /* semantic colors igual */
}
```

### Toggle de Tema

El `ThemeToggleComponent` permite cambiar entre temas:
- Botón con icono ☀️/🌙
- Animación suave (0.4s transition)
- Persistencia en localStorage

---

## Guía de Componentes

### Estructura de un Componente Típico

```
mi-pagina/
├── mi-pagina.component.ts      # Lógica (class)
├── mi-pagina.component.html    # Template (HTML)
├── mi-pagina.component.scss    # Estilos (SCSS)
├── models/                      # Modelos de datos (opcional)
│   └── mi-pagina.model.ts
└── service/                     # Servicios específicos (opcional)
    └── mi-pagina.service.ts
```

### Patrón de Componente

```typescript
@Component({
  selector: 'app-mi-pagina',
  standalone: true,              // Angular 17+ standalone
  imports: [CommonModule, ...],   // Módulos necesarios
  templateUrl: './mi-pagina.component.html',
  styleUrls: ['./mi-pagina.component.scss']
})
export class MiPaginaComponent implements OnInit {
  // Inyección de servicios
  constructor(
    private miService: MiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    // Cargar datos...
  }
}
```

### Estilos Consistenes entre Componentes

Todos los componentes de página siguen el mismo patrón visual:

```scss
// Contenedor principal
.mi-pagina-container {
  min-height: 100vh;
  background: var(--bg-base);
  padding: 20px;
  max-width: 1200px;      // Ancho máximo consistente
  margin: 0 auto;          // Centrado
  transition: background 0.4s ease;
}

// Header de la página
.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  background: var(--bg-surface);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

// Card de contenido
.content-card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border);
}

// Header interno del card
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
}
```

---

## Modelos de Datos

### Modelo de Usuario

```typescript
interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: 'Admin Global' | 'Admin Local' | 'Mesero' | 'Cajero';
  sede_id: number | null;  // null = Admin Global
  estado: 'Activo' | 'Inactivo';
  created_at: string;
}
```

### Modelo de Sede

```typescript
interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}
```

### Modelo de Producto

```typescript
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  sede_id: number;
  estado: 'Activo' | 'Inactivo';
}
```

### Modelo de Mesa

```typescript
interface Mesa {
  id: number;
  numero_mesa: string;
  sede_id: number;
  estado: 'LIBRE' | 'OCUPADA';
}
```

### Modelo de Pedido

```typescript
interface Pedido {
  id: number;
  sede_id: number;
  mesa_id: number;
  mesero_id: number;
  estado: 'ABIERTO' | 'ENVIADO_A_CAJA' | 'CERRADO' | 'CANCELADO';
  detalles: DetallePedido[];
  created_at: string;
}

interface DetallePedido {
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
```

### Modelo de Pago

```typescript
interface HistorialPago {
  pago_id: number;
  pedido_id: number;
  numero_mesa: string;
  usuario_cajero_id: number;
  medio_pago: 'EFECTIVO' | 'TC' | 'TD';
  monto_cobrado: number;
  fecha_pago: string;
}
```

---

## Comandos Útiles

### Desarrollo

```bash
# Instalar dependencias (solo una vez)
npm install

# Servidor de desarrollo (recarga en vivo)
ng serve

# Servidor en puerto específico
ng serve --port 4201

# Abrir en navegador automáticamente
ng serve --open
```

### Build

```bash
# Build de desarrollo
ng build

# Build de producción (optimizado)
ng build --configuration production

# Build con configuration específica
ng build --configuration=development
```

### Testing

```bash
# Tests unitarios (Karma+Jasmine)
ng test

# Tests en navegador específico
ng test --browsers=Chrome

# Coverage report
ng test --code-coverage
```

### Utilidades Angular

```bash
# Generar nuevo componente
ng generate component pages/mi-componente

# Generar nuevo servicio
ng generate service services/mi-servicio

# Generar nuevo guard
ng generate guard guards/mi-guard

# Verificar lint
ng lint
```

---

## Solución de Problemas

### Error: Cannot find module '...'

**Causa**: Dependencias no instaladas.
**Solución**: `npm install`

### Error: Port 4200 is already in use

**Causa**: Otra aplicación usando el puerto.
**Solución**:
```bash
ng serve --port 4201
# o matar el proceso en ese puerto
```

### Página en blanco

**Causa**: Backend no está corriendo.
**Solución**: Verificar que todos los servicios del backend estén activos en los puertos correctos.

### 401 Unauthorized

**Causa**: Token expirado o inválido.
**Solución**: Hacer logout y login de nuevo. Si persiste, verificar que el clock del sistema esté correcto (JWT usa timestamps UTC).

### Cambios no se reflejan

**Causa**: Servidor de desarrollo no recargó.
**Solución**: Reiniciar `ng serve`

### Error de CORS

**Causa**: Backend no permite el origen de Angular.
**Solución**: Configurar CORS en el API Gateway para permitir `http://localhost:4200`

---

## Arquitectura de Archivos por Funcionalidad

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        EDITAR POR FUNCIONALIDAD                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  AUTENTICACIÓN                                                               ║
║  ├─ src/app/services/auth.service.ts         Lógica de auth                  ║
║  ├─ src/app/guards/auth.guard.ts             ¿Está logueado?                  ║
║  ├─ src/app/guards/role.guard.ts            ¿Tiene rol?                      ║
║  ├─ src/app/interceptors/auth.interceptor.ts Adjunta JWT                     ║
║  └─ src/app/demo/pages/login/                Componente de login              ║
║                                                                               ║
║  TEMAS                                                                       ║
║  ├─ src/app/services/theme.service.ts        Estado del tema                  ║
║  ├─ src/app/shared/components/theme-toggle/  Botón toggle                     ║
║  └─ src/styles.css                           Variables CSS                     ║
║                                                                               ║
║  GESTIÓN DE USUARIOS (Admin Global)                                          ║
║  └─ src/app/demo/pages/usuarios/             CRUD usuarios                    ║
║                                                                               ║
║  GESTIÓN DE SEDES (Admin Global)                                             ║
║  └─ src/app/demo/pages/sedes/                CRUD sedes                       ║
║                                                                               ║
║  GESTIÓN DE PRODUCTOS (Admin Global)                                         ║
║  └─ src/app/demo/pages/productos/             CRUD productos                  ║
║                                                                               ║
║  INVENTARIO (Admin Global, Admin Local)                                      ║
║  └─ src/app/demo/pages/inventario/            Stock y movimientos             ║
║                                                                               ║
║  PEDIDOS (Admin Global, Mesero)                                             ║
║  └─ src/app/demo/pages/pedido/                 Tomar pedidos                   ║
║                                                                               ║
║  CAJA (Admin Global, Cajero)                                                ║
║  └─ src/app/demo/pages/caja/                   Cobrar pedidos                 ║
║                                                                               ║
║  MESAS (Admin Global, Admin Local)                                          ║
║  └─ src/app/demo/pages/mesas/                   Gestión de mesas                ║
║                                                                               ║
║  HISTORIAL (Admin Global, Cajero)                                           ║
║  └─ src/app/demo/pages/historial/               Historial de pagos             ║
║                                                                               ║
║  REPORTES (Admin Global, Admin Local)                                       ║
║  └─ src/app/demo/pages/reportes/                Reportes                       ║
║                                                                               ║
║  RUTAS                                                                      ║
║  └─ src/app/app.routes.ts                 Definición de rutas                ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## Próximas Mejoras (TODO)

- [ ] Tests E2E con Angular Testing Library
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Exportación a Excel/CSV de reportes
- [ ] Optimización de imágenes de productos
- [ ] PWA support para instalación en tablets

---

**MIT License** - Libre para usar y modificar.

¿Preguntas? Revisa la sección de [Solución de Problemas](#solución-de-problemas) primero.
