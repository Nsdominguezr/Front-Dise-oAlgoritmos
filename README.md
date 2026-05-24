# Bar Don Juancho - Frontend

**Sistema de gestión táctil multi-sede *


---

## Tabla de Contenidos

1. [¿Qué es esto?](#¿qué-es-esto)
2. [¿Qué necesito para запустить?](#¿qué-necesito-para-ejecutar)
3. [Instalación en 5 pasos](#instalación-en-5-pasos)
4. [¿Cómo funciona el sistema?](#¿cómo-funciona-el-sistema)
5. [Estructura del proyecto (Explicado)](#estructura-del-proyecto-explicado)
6. [Páginas existentes](#páginas-existentes)
7. [Sistema de Roles (¿Quién ve qué?)](#sistema-de-roles-quién-ve-qué)
8. [Colores y Temas](#colores-y-temas)
9. [Comandos útiles](#comandos-útiles)
10. [Problemas comunes](#problemas-comunes)

---

## ¿Qué es esto?

**Bar Don Juancho** es una aplicación web que ayuda a gestionar un bar con varias sedes. Permite:

- **Administrar usuarios** (¿Quién es mesero? ¿Quién es cajero?)
- **Administrar sedes** (Bar Norte, Bar Centro, Bar Sur)
- **Administrar productos** (¿Qué vendemos? Precios, categorías)
- **Administrar inventario** (¿Cuántas cajas de cerveza tenemos?)
- **Tomar pedidos** (El mesero toma la orden en una mesa)
- **Cobrar** (El cajero cobra la cuenta)

### Características principales:
- 🌙 Modo oscuro y modo claro
- 📱 Diseñado para pantallas táctiles
- 🔐 Seguro con tokens (JWT)
- 👥 Diferentes tipos de usuarios con diferentes permisos

---

## ¿Qué necesito para ejecutar?

### Software obligatorio:

| Programa | ¿Para qué? | ¿Dónde bajarlo? |
|----------|------------|------------------|
| **Node.js 18+** | Ejecuta el código de Angular | [nodejs.org](https://nodejs.org/) |
| **npm 9+** | Instala las dependencias (viene con Node) | ya viene con Node |
| **Backend funcionando** | Sin esto, la app no funciona | (ver sección siguiente) |

### El Backend debe estar corriendo en estos puertos:

```
Puerto 8000 - API Gateway (el que recibe todas las peticiones)
Puerto 5001 - Auth Service (login, usuarios)
Puerto 5002 - Catalog Service (sedes, productos)
Puerto 5003 - Inventory Service (inventario)
Puerto 5004 - Orders Service (pedidos, caja)
```

> 💡 **¿No sabes qué es el backend?** Es el programa que está "detrás" guardando datos en una base de datos. Sin él, esta aplicación no puede hacer nada.

---

## Instalación en 5 pasos

### Paso 1: Instalar Node.js
Descarga Node.js 18+ desde [nodejs.org](https://nodejs.org/). Durante la instalación, npm también se instala automáticamente.

**Para verificar que se instaló correctamente:**
```bash
node --version
npm --version
```

Deberías ver algo como `v18.x.x` y `9.x.x`.

### Paso 2: Entrar a la carpeta del proyecto
```bash
cd /home/user/Documentos/Diseño\ de\ algoritmos/Front/Front-Dise-oAlgoritmos
```

### Paso 3: Instalar dependencias
```bash
npm install
```

> ⏳ Esto puede tardar 2-5 minutos. No te preocupes si parece lento.

### Paso 4: Asegurarte que el backend esté corriendo
Abre terminal y ejecuta (en las carpetas correctas del backend):
```bash
# Terminal 1
cd /home/user/Documentos/Diseño\ de\ algoritmos/back/api_gateway
python app.py

# Terminal 2
cd /home/user/Documentos/Diseño\ de\ algoritmos/back/service_master
python app.py

# Terminal 3
cd /home/user/Documentos/Diseño\ de\ algoritmos/back/catalog_service
python app.py

# Terminal 4
cd /home/user/Documentos/Diseño\ de\ algoritmos/back/inventory_service
python app.py

# Terminal 5
cd /home/user/Documentos/Diseño\ de\ algoritmos/back/orders_service
python app.py
```

### Paso 5: Levantar el frontend
```bash
ng serve
```

Ahora abre tu navegador y ve a: **`http://localhost:4200`**

---

## ¿Cómo funciona el sistema?

### El flujo básico de una acción:

```
[USUARIO] → [FRONTEND (Angular)] → [API GATEWAY (Puerto 8000)] → [BACKEND (Python)]
                                       ↓
                               ¿A dónde va la petición?
                               - /api/auth/* → Auth Service (5001)
                               - /api/sedes/* → Catalog Service (5002)
                               - /api/productos/* → Catalog Service (5002)
                               - /api/inventario/* → Inventory Service (5003)
                               - /api/pedidos/* → Orders Service (5004)
```

### Ejemplo: Usuario quiere ver el inventario

1. **Usuario** hace clic en "Manage Inventory"
2. **Frontend** pregunta: ¿Estás logueado? (AuthGuard)
3. **Si está logueado**, el frontend pide los datos al API Gateway
4. **API Gateway** redirige la petición a Inventory Service (puerto 5003)
5. **Inventory Service** consulta la base de datos
6. **La respuesta** regresa por el mismo camino hasta el frontend
7. **Frontend** muestra los datos en pantalla

---

## Estructura del Proyecto (Explicado)

```
Front-Dise-oAlgoritmos/
├── src/                          # Todo el código fuente está aquí
│   ├── app/                      # La aplicación principal
│   │   ├── demo/                 # Carpeta con las páginas
│   │   │   └── pages/
│   │   │       ├── login/        # Página de login
│   │   │       ├── dashboard/     # Página principal (home)
│   │   │       ├── usuarios/      # Gestión de usuarios
│   │   │       ├── sedes/        # Gestión de sedes
│   │   │       ├── productos/    # Gestión de productos
│   │   │       ├── inventario/  # Gestión de inventario
│   │   │       ├── pedido/       # Tomar pedidos (meseros)
│   │   │       └── caja/         # Cobrar pedidos (cajeros)
│   │   ├── services/             # Conexiones al backend
│   │   │   ├── auth.service.ts    # Login, logout
│   │   │   ├── producto.service.ts # Productos
│   │   │   ├── inventario.service.ts # Inventario
│   │   │   └── sede.service.ts   # Sedes
│   │   ├── guards/               # Protectores de rutas
│   │   │   ├── auth.guard.ts     # ¿Estás logueado?
│   │   │   └── role.guard.ts     # ¿Tienes permiso?
│   │   └── interceptors/         # Automatizaciones
│   │       └── auth.interceptor.ts # Agrega el token a cada petición
│   ├── styles.css                # Colores del tema (oscuro/claro)
│   └── index.html                # Punto de entrada HTML
├── dist/                         # Archivos compilados (para producción)
└── node_modules/                 # Dependencias instaladas (NO TOCAR)
```

### Explicación rápida de cada carpeta:

| Carpeta | ¿Qué hace? |
|---------|------------|
| `pages/` | Cada página de la aplicación (login, dashboard, etc) |
| `services/` | Conexiones al backend. Piden datos, guardan datos |
| `guards/` | Revisan si puedes entrar a una página o no |
| `interceptors/` | Automatizaciones que pasan en cada petición HTTP |

---

## Páginas Existentes

| Ruta | Página | ¿Quién puede verla? |
|------|--------|---------------------|
| `/login` | Login | Todos (público) |
| `/dashboard` | Home | Todos los logueados |
| `/usuarios` | Gestión de usuarios | Admin Global |
| `/sedes` | Gestión de sedes | Admin Global |
| `/productos` | Gestión de productos | Admin Global |
| `/inventario` | Gestión de inventario | Admin Global, Admin Local |
| `/pedido` | Tomar pedidos | Admin Global, Mesero |
| `/caja` | Cobrar pedidos | Admin Global, Cajero |

---

## Sistema de Roles (¿Quién ve qué?)

Hay 4 tipos de usuarios en el sistema:

### 1. Admin Global 🏢
**El jefe máximo.** Puede ver y hacer TODO.

| Puede ver | Puede hacer |
|-----------|-------------|
| Todas las sedes | Crear/editar/borrar todo |
| Todos los usuarios | Registrar nuevos usuarios |
| Todos los productos | Gestionar el catálogo completo |
| Inventario de todas las sedes | Ingresar y sacar stock |
| Pedidos de todas las sedes | Ver y cobrar cualquier pedido |
| **Reports (proximamente)** | Ver estadísticas |

### 2. Admin Local 🏪
**El administrador de UNA sede.**

| Puede ver | Puede hacer |
|-----------|-------------|
| Solo su sede | Gestionar inventario de su sede |
| Solo su inventario | Registrar ingresos y mermas |
| No ve otras sedes | Ver historial de movimientos |

### 3. Mesero 🍽️
**El que toma las orders.**

| Puede ver | Puede hacer |
|-----------|-------------|
| Su sede | Abrir pedidos en mesas |
| Opción de pedidos | Agregar productos a la orden |
| No ve inventario (directamente) | Enviar pedido a caja |

### 4. Cajero 💰
**El que cobra.**

| Puede ver | Puede hacer |
|-----------|-------------|
| Solo opción de caja | Ver pedidos pendientes |
| Pedidos de su sede | Cobrar un pedido |
| No ve inventario | Elegir medio de pago |

---

## Colores y Temas

La aplicación tiene dos temas: **Oscuro** (para la noche) y **Claro** (para el día).

### Tema Oscuro (Modo Noche) 🌙

| Elemento | Color | Hex |
|----------|-------|-----|
| Fondo principal | Negro azulado | `#0F1117` |
| Cards/ventanas | Gris oscuro azulado | `#171C28` |
| Elementos elevados | Gris azulado | `#1E2638` |
| Bordes | Gris azulado claro | `#2B3A5C` |
| Botones primarios | Azul | `#4A6FD4` |
| Texto principal | Azul claro | `#C8D4FF` |
| Error/Peligro | Rojo | `#e94560` |
| Éxito | Verde | `#27ae60` |

### Tema Claro (Modo Día) ☀️

| Elemento | Color | Hex |
|----------|-------|-----|
| Fondo principal | Gris azulado clarito | `#EDF0FA` |
| Cards/ventanas | Blanco | `#FAFBFF` |
| Elementos elevados | Blanco puro | `#FFFFFF` |
| Bordes | Gris clarito | `#DDE3F5` |
| Botones primarios | Azul | `#4A6FD4` |
| Texto principal | Azul oscuro | `#1E1E5D` |

> 💡 **Nota:** Los colores de los botones (`primary` y `accent`) son IGUALES en ambos temas. Así el sistema se siente consistente.

### ¿Cómo cambio el tema?

Hay un botón en la esquina superior derecha de cada página (🌙/☀️). Al hacer clic, cambia instantáneamente.

---

## Comandos útiles

### Para desarrollar (durante el trabajo)

```bash
# Instalar todo lo necesario (solo una vez al inicio)
npm install

# Levantar el servidor de desarrollo
# Se actualiza SOLO cuando guardas un archivo
ng serve

# Ver el proyecto en el navegador
# http://localhost:4200
```

### Para construir (para producción)

```bash
# Build normal (desarrollo)
ng build

# Build para producción (más optimizado)
ng build --configuration production

# Los archivos compilados van a la carpeta "dist/"
```

### Para testing

```bash
# Ejecutar pruebas unitarias
ng test

# Ejecutar y ver en el navegador
ng test --browsers=Chrome
```

---

## Problemas comunes

### ❌ "Error: Cannot find module"
**Causa:** No instalaste las dependencias.
**Solución:** Ejecuta `npm install`

### ❌ "Error: Port 4200 is already in use"
**Causa:** Ya hay algo corriendo en ese puerto.
**Solución:** Cierra la otra aplicación o ejecuta `ng serve --port 4201`

### ❌ La página está en blanco
**Causa:** El backend no está corriendo.
**Solución:** Asegúrate que todos los servicios del backend estén activos (puertos 8000, 5001, 5002, 5003, 5004)

### ❌ "401 Unauthorized" al hacer peticiones
**Causa:** Tu token expiró o no estás logueado.
**Solución:** Cierra sesión (logout) y vuelve a entrar.

### ❌ No puedo acceder a una página
**Causa:** Tu rol no tiene permiso para esa página.
**Solución:** Consulta la tabla de [Sistema de Roles](#sistema-de-roles-quién-ve-qué)

---

## Arquitectura de Carpetas Detallada

```
Cuando quieras modificar algo, aquí está el "mapa":

📄 EDITAR PÁGINAS (lo que ve el usuario):
src/app/demo/pages/
├── login/            → LoginComponent (login.component.ts + .html + .scss)
├── dashboard/         → DashboardComponent (home)
├── usuarios/          → UsuariosComponent (lista de usuarios)
├── sedes/            → SedesComponent (lista de sedes)
├── productos/         → ProductosComponent (catálogo)
├── inventario/        → InventarioComponent (stock)
├── pedido/            → PedidoComponent (tomar pedidos)
└── caja/             → CajaComponent (cobrar)

📄 EDITAR CONEXIONES AL BACKEND:
src/app/services/
├── auth.service.ts     → Login, logout, refresh token
├── sede.service.ts     → CRUD de sedes
├── producto.service.ts → CRUD de productos
├── inventario.service.ts → Stock y movimientos
└── theme.service.ts    → Cambio de tema

📄 EDITAR SEGURIDAD:
src/app/guards/
├── auth.guard.ts       → ¿Estás logueado?
└── role.guard.ts       → ¿Tienes el rol correcto?

📄 EDITAR COLORES:
src/styles.css          → Variables CSS (tema completo)
```

---

## Próximos Pasos (TODO)

- [ ] Reports para Admin Global (pendiente)
- [ ] Tests E2E (HU-030)
- [ ] Exportar datos a Excel
- [ ] Notificaciones en tiempo real

---

## Licencia

MIT - Libre para usar y modificar.

---

**¿Preguntas? ¿Problemas? Revisa la sección de [Problemas comunes](#problemas-comunes) primero.**