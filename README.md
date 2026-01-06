# 🚀 Node.js Express PostgreSQL API (CRUD)

Este es un proyecto de práctica profesional para desarrollar una API RESTful robusta. Implementa un sistema completo de gestión de usuarios con validación de datos en tiempo real, persistencia en **PostgreSQL** y una arquitectura de código limpia y escalable.

---

## 🛠️ Tecnologías y Herramientas

* **Node.js & Express**: Entorno de ejecución y framework web.
* **PostgreSQL**: Sistema de gestión de base de datos relacional.
* **node-postgres (pg)**: Cliente para la comunicación entre Node y Postgres.
* **Zod**: Librería de validación de esquemas.
* **Morgan**: Logger para monitorear peticiones HTTP en consola.
* **DBeaver**: Herramienta de administración visual de la base de datos.
* **pnpm**: Gestor de paquetes rápido y eficiente.

---

## 📋 Características Principales

* ✅ **CRUD Completo**: Crear, Leer, Actualizar y Eliminar registros.
* ✅ **Paginación del Lado del Servidor**: Consultas optimizadas usando `LIMIT`, `OFFSET` y `COUNT(*) OVER()`.
* ✅ **Validación de Esquemas**: Middleware que intercepta datos incorrectos antes de tocar la base de datos.
* ✅ **Manejo de Errores Estandarizado**: Respuestas JSON consistentes con mensajes claros y códigos de estado HTTP adecuados.
* ✅ **Búsqueda Parcial**: Endpoint para buscar usuarios por nombre usando `ILIKE`.

---

## ⚙️ Configuración e Instalación

### 1. Requisitos Previos
* Tener instalado **Node.js**.
* Tener instalado **PostgreSQL**.
* Tener instalado **pnpm** (`npm install -g pnpm`).

### 2. Clonar y Preparar
```bash
# Clonar repositorio
git clone https://github.com/jesusdavid31/node-rest-api.git

# Entrar a la carpeta
cd postgresql-node-restapi

# Instalar dependencias
pnpm install

```



### 3. Configurar la Base de Datos

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Variables de Entorno

```
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=your_port
DB_DATABASE=your_database
```

### 5. 🚀 Ejecución: Para iniciar el servidor en modo desarrollo con recarga automática

`npm run dev`

## License

This project is open-sourced software licensed under the MIT License.