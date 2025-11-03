# 🚀 Feraytek API

**Feraytek API** es la interfaz oficial del sistema **Feraytek**, diseñada para gestionar la comunicación entre la base de datos relacional MySQL y las aplicaciones cliente del ecosistema (Web y Escritorio).  
Su principal propósito es ofrecer un servicio robusto, seguro y escalable para el manejo de usuarios, productos, pedidos, pagos y estadísticas dentro de la plataforma.

---

## 🧩 Propósito de la API

Esta API constituye el **núcleo backend del sistema Feraytek**, brindando endpoints RESTful para:

- Gestionar la información de productos, usuarios, pedidos y categorías.
- Controlar las operaciones administrativas y comerciales.
- Proveer autenticación segura mediante **JWT**.
- Integrar estadísticas dinámicas y reportes para el panel de administración.

Desarrollada bajo arquitectura **MVC** y utilizando **Node.js**, **Express** y **MySQL**, la API garantiza una separación clara de responsabilidades, manteniendo un entorno modular y fácil de mantener.

---

## 🔗 Enlaces del ecosistema

<div align="center">

| Aplicación | Repositorio |
|-------------|-------------|
| 🛍️ **Aplicación Web – Tienda Online** | [Ver repositorio »](https://github.com/tu-usuario/feraytek-web) |
| 🖥️ **Aplicación de Escritorio – Panel Administrativo (Electron)** | [Ver repositorio »](https://github.com/tu-usuario/feraytek-desktop) |

</div>

---

## 🧾 Información general

- **Lenguaje principal:** JavaScript (Node.js)  
- **Framework:** Express.js  
- **Base de datos:** MySQL  
- **Arquitectura:** MVC + Service Layer  
- **Autenticación:** JSON Web Tokens (JWT)

---

### 👥 Autores

| Nombre | Rol | GitHub |
|--------|------|---------|
| **Ariel Fernández** | Desarrollador Backend y Coordinador del proyecto | 🔗 [@Arhiell](https://github.com/Arhiell) |
| **Leonel Fernández** | Desarrollador Frontend y Tester | 🔗 [@fernandez-leonel](https://github.com/fernandez-leonel) |


> © 2025 **Feraytek Systems** – Proyecto académico desarrollado con fines educativos y de integración tecnológica.
# 🛒 Feraytek — Plataforma e‑commerce con Panel Administrativo

![Feraytek](https://img.shields.io/badge/Feraytek-eCommerce%20%2B%20Admin-FF6F61?style=for-the-badge) 
![Versión](https://img.shields.io/badge/version-v0.1.0-blue?style=flat-square)
![Estado](https://img.shields.io/badge/estado-En%20desarrollo-yellow?style=flat-square)
![Licencia](https://img.shields.io/badge/licencia-MIT-green?style=flat-square)
![Autor](https://img.shields.io/badge/autor-Arhiell-8A2BE2?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Electron%20%7C%20Docker%20%7C%20MySQL-333?style=flat-square)

Plataforma integral que combina un sitio web de comercio electrónico para clientes y una aplicación de escritorio para administración y análisis, construida con tecnologías modernas y una arquitectura modular escalable.

---

## 🚀 Descripción General

Feraytek es un sistema de gestión de e‑commerce con dos componentes principales:

- Aplicación de Escritorio (Administrador y SuperAdmin): desarrollada con Node.js y Electron, empaquetada y orquestada con Docker bajo arquitectura MVC. Permite administrar usuarios, productos, pedidos, pagos, inventario y estadísticas.
- Aplicación Web (Cliente / Usuario Final): desarrollada con Node.js, Express, HTML, CSS y JavaScript. Enfocada en la experiencia de compra, catálogo y seguimiento de pedidos.

Ambas aplicaciones se integran mediante servicios y una base de datos MySQL. El panel administrativo alimenta los datos del frontend web a través de APIs REST, manteniendo consistencia y trazabilidad.

---

## 🧱 Arquitectura General

- Patrón MVC (Modelo‑Vista‑Controlador) aplicado a ambos proyectos para separar responsabilidades y favorecer el mantenimiento.
- Backend con Node.js y Express expone endpoints REST para el panel y el sitio web.
- Persistencia en MySQL, con conexión mediante driver `mysql2` (o un ORM a elección) y migraciones controladas.
- Aplicación de escritorio con Electron: proceso principal (main) y renderers, integrando la UI del panel con los servicios backend.
- Contenedores Docker para base de datos y servicios auxiliares; `docker-compose` simplifica la orquestación local.
- Comunicación entre servicios vía HTTP/REST y, opcionalmente, WebSockets para notificaciones en tiempo real.

Diagrama conceptual (simplificado):

```
[Electron Admin] --HTTP--> [API Express] --SQL--> [MySQL]
        |                                ^
        |                                |
        +---- Admin UI ----> Gestiona datos que sirven al Front Web
                                        |
[Cliente Web (Express + HTML/CSS/JS)] ---+
```

---

## ⚙️ Instalación y Configuración

Clona cada repositorio y prepara el entorno.

### 1) Aplicación de Escritorio (Administrador)

Repositorio: https://github.com/Arhiell/Feraytek.git

```bash
git clone https://github.com/Arhiell/Feraytek.git
cd Feraytek
npm install

# Entorno de desarrollo
npm start

# (Opcional) Ejecutar servicios con Docker
docker-compose up -d
```

### 2) Aplicación Web (Cliente)

Repositorio: https://github.com/Arhiell/FeraytekWeb.git

```bash
git clone https://github.com/Arhiell/FeraytekWeb.git
cd FeraytekWeb
npm install

# Entorno de desarrollo
npm start

# (Opcional) Ejecutar servicios con Docker
docker-compose up -d
```

### Variables de entorno (.env)

Ejemplo para Escritorio (Admin):

```env
# Núcleo
NODE_ENV=development
PORT=3001
JWT_SECRET=supersecret_cambiar

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=feraytek_user
DB_PASSWORD=feraytek_pass
DB_NAME=feraytek_db

# Electron
ELECTRON_START_URL=http://localhost:3001

# Integraciones (ejemplo Mercado Pago - sandbox)
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxx
MP_PUBLIC_KEY=TEST-xxxxxxxxxxxxxxxxxxxx

# CORS
CORS_ORIGIN=http://localhost:3000
```

Ejemplo para Web (Cliente):

```env
NODE_ENV=development
PORT=3000

# API del panel (Express)
API_BASE_URL=http://localhost:3001/api

# Autenticación
JWT_PUBLIC_KEY=MI_PUBLIC_KEY_O_SECRETO_COMPARTIDO

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Docker Compose (ejemplo)

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    container_name: feraytek-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: feraytek_db
      MYSQL_USER: feraytek_user
      MYSQL_PASSWORD: feraytek_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db_data:
```

---

## 🧭 Estructura del Proyecto

Estructuras orientativas para mantener coherencia entre ambos repositorios.

### Escritorio (Feraytek)

```
Feraytek/
├─ src/
│  ├─ models/
│  ├─ controllers/
│  ├─ routes/
│  ├─ views/
│  ├─ config/
│  ├─ services/
│  ├─ middlewares/
│  ├─ utils/
│  └─ app.js
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ docker/
│  └─ docker-compose.yml
├─ logs/
└─ README.md
```

### Web (FeraytekWeb)

```
FeraytekWeb/
├─ src/
│  ├─ routes/
│  ├─ controllers/
│  ├─ models/
│  ├─ middlewares/
│  ├─ public/
│  │  ├─ css/
│  │  ├─ js/
│  │  └─ img/
│  ├─ views/
│  ├─ config/
│  └─ app.js
├─ logs/
└─ README.md
```

- Sistema de logs: `winston` o `morgan` para auditoría de peticiones y errores.
- Middleware: `cors`, `helmet`, validaciones, autenticación y manejo de errores centralizado.

---

## 🧪 Tecnologías Principales

- Node.js, Express, Electron, Docker, MySQL
- JavaScript, HTML, CSS
- Librerías auxiliares: `dotenv`, `cors`, `helmet`, `jsonwebtoken`, `bcrypt`, `mysql2`, `multer`, `winston/morgan`
- Integraciones: pasarela de pago (ej. Mercado Pago en sandbox), servicios de terceros.

---

## 🧰 Características Clave

- Roles: Administrador, SuperAdmin y Cliente.
- Gestión de usuarios, productos, pedidos, pagos y estadísticas.
- Panel de administración con control total (catálogo, stock, descuentos, facturación, reportes).
- Sitio web responsive para el cliente, optimizado para búsqueda y compra.
- Integración de APIs (ej. Mercado Pago, sandbox) para pagos.
- Módulo de reportes y visualización de métricas clave.

---

## 📸 Capturas de Pantalla

Agrega tus imágenes en `docs/screenshots/` y referencia aquí:

- Login (Admin):
  
  ![Login Admin](docs/screenshots/login-admin.png)

- Dashboard (Admin):

  ![Dashboard Admin](docs/screenshots/dashboard-admin.png)

- Productos (Admin):

  ![Productos Admin](docs/screenshots/products-admin.png)

- Pedidos y Estadísticas (Admin):

  ![Pedidos y Estadísticas](docs/screenshots/orders-stats.png)

- Interfaz del Cliente (Web):

  ![Catálogo Cliente](docs/screenshots/client-catalog.png)

---

## 🌐 Enlaces Oficiales

- 🖥️ Escritorio (Admin): Feraytek — GitHub → https://github.com/Arhiell/Feraytek
- 💻 Web (Cliente): FeraytekWeb — GitHub → https://github.com/Arhiell/FeraytekWeb

---

## 👥 Autores y Créditos

- Autor principal: Ariel (Arhiell)
- GitHub: https://github.com/Arhiell
- Colaboradores: _agregar aquí si aplica_

---

## 🧾 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

- MIT: https://opensource.org/licenses/MIT

---

## 🧱 Estado del Proyecto

- Estado actual: En desarrollo (versión beta).
- Próximos pasos:
  - Autenticación multifactor (2FA) para Administradores.
  - Notificaciones en tiempo real (WebSockets) para eventos críticos.
  - Mejoras en reportes (exportación a CSV/PDF).
  - Optimizaciones de rendimiento y seguridad.

---

## 🧠 Contribución

¡Contribuciones son bienvenidas! Sigue estos pasos:

1. Realiza un fork del repositorio.
2. Crea una rama feature: `git checkout -b feat/nueva-funcionalidad`.
3. Haz commits siguiendo buenas prácticas: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
4. Abre un Pull Request describiendo cambios, contexto y pruebas.

Guías sugeridas:

- Estilo de commits: https://www.conventionalcommits.org/es/v1.0.0/
- Issues y PRs: agrega etiquetas y una descripción clara.

---

## 🧩 Soporte y Contacto

- Reporta errores o solicitudes en la sección de Issues:
  - Feraytek (Admin): https://github.com/Arhiell/Feraytek/issues
  - FeraytekWeb (Cliente): https://github.com/Arhiell/FeraytekWeb/issues

- Para consultas generales: abre un Issue o agrega comentarios en los PRs.

---

## ✅ Notas

- Este README está orientado a documentación técnica en español neutro.
- Adapta variables y puertos a tu entorno.
- Asegura la creación y migración del esquema MySQL antes de iniciar.
