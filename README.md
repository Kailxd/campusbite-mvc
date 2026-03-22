# CampusBite MVC

Aplicación web académica con patrón MVC para una cafetería universitaria.

## Funcionalidades incluidas
- Seguridad: registro, login, logout, roles
- CRUD de productos
- CRUD de usuarios
- Control de inventario
- Transacción de pedido con descuento de stock usando PostgreSQL `BEGIN / COMMIT / ROLLBACK`
- Dashboard por rol

## Stack
- Node.js
- Express
- EJS
- PostgreSQL
- Bootstrap 5

## Roles
- `admin`
- `empleado`
- `inventario`
- `estudiante`

## Usuario administrador inicial
- Correo: `admin@campusbite.com`
- Contraseña: `Admin123*`

## 1) Ejecutarlo en Visual Studio Code localmente
### Requisitos
- Node.js 18+
- PostgreSQL 14+

### Base de datos
1. Crea una base de datos llamada `campusbite` en PostgreSQL.
2. Copia `.env.example` a `.env`.
3. Ajusta `DATABASE_URL` con tus credenciales locales.

Ejemplo:
```env
PORT=3000
DATABASE_URL=postgres://postgres:tu_password@localhost:5432/campusbite
SESSION_SECRET=una_clave_larga_y_segura
NODE_ENV=development
```

### Instalar y correr
```bash
npm install
npm start
```

Abre `http://localhost:3000`

> Al iniciar por primera vez, el sistema crea tablas y carga productos de ejemplo automáticamente.

## 2) Subirlo a GitHub
### En VS Code terminal
```bash
git init
git add .
git commit -m "Proyecto inicial CampusBite"
```

Crea un repo en GitHub y después ejecuta:
```bash
git remote add origin TU_URL_DEL_REPO
git branch -M main
git push -u origin main
```

## 3) Subirlo a Render (método manual)
### Paso A. Crear cuenta
- Entra a Render y crea tu cuenta.

### Paso B. Crear base de datos Postgres
1. En el dashboard de Render entra a **New > Postgres**.
2. Pon el nombre `campusbite-db`.
3. Elige una región cercana y el plan que usarán.
4. Cuando se cree, abre la base y copia la **Internal Database URL** o usa la variable `DATABASE_URL`. Render explica que debes crear tu base desde **New > Postgres** y usar la URL de conexión disponible en el menú Connect. citeturn172490search1

### Paso C. Crear servicio web
1. En Render entra a **New > Web Service**.
2. Conecta tu repo de GitHub.
3. Usa estos valores:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Render documenta este flujo para apps Node/Express en su quickstart oficial. citeturn172490search0

### Paso D. Variables de entorno
Agrega estas variables en Render:
- `NODE_ENV=production`
- `SESSION_SECRET=una_clave_larga`
- `DATABASE_URL=` la URL de tu Postgres en Render

### Paso E. Deploy
1. Guarda la configuración.
2. Espera a que termine el deploy.
3. Render te dará una URL pública tipo `https://tu-app.onrender.com`.

Render también indica que las instancias gratuitas sirven para pruebas y demos, pero no para producción real. citeturn172490search8

## 4) Subirlo a Render con render.yaml (más fácil)
Este proyecto incluye `render.yaml`.

1. Sube el proyecto a GitHub.
2. En Render usa **New + > Blueprint**.
3. Selecciona tu repositorio.
4. Render leerá `render.yaml` y creará el web service y la base de datos.

## 5) Qué revisar si falla
- Que `DATABASE_URL` esté bien escrita.
- Que PostgreSQL esté activa.
- Que el repositorio incluya `package.json`.
- Que Render detecte `npm start` correctamente.
- Ver logs del servicio en Render.

## Estructura MVC
```text
src/
  controllers/
  models/
  routes/
  middlewares/
  views/
  config/
public/
```

## Nota académica
Este proyecto está pensado para demostración académica. Usa sesiones simples de Express para facilitar la entrega. Para producción sería recomendable usar almacenamiento persistente de sesiones, validaciones más estrictas y manejo avanzado de seguridad.
