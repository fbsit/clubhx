## ClubHX — Monorepo (Backend + Frontend)

Proyecto full‑stack compuesto por un backend en NestJS (TypeORM + PostgreSQL) y un frontend en Vite + React + Tailwind.

### Estructura

- `backend-clubhx`: API en NestJS (puerto 3001 por defecto)
- `frontend-clubhx`: SPA en Vite/React (puerto 8080 por defecto)

### Requisitos

- Node.js 18+ (recomendado 20+)
- Paquete de gestor: Yarn o npm (el repo incluye `yarn.lock`)
- PostgreSQL 13+ en local

### Puertos y URLs por defecto

- Backend: `http://localhost:3001`
  - Swagger: `http://localhost:3001/docs`
- Frontend (dev): `http://localhost:8080`
  - Proxy de desarrollo `/api` → `http://localhost:3001`

### Base de datos (desarrollo)

La conexión a PostgreSQL está definida en `backend-clubhx/src/app.module.ts`:

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '2805',
  database: 'clubhx',
  autoLoadEntities: true,
  synchronize: true, // solo desarrollo
})
```

Actualiza estas credenciales según tu entorno local. En producción, usa variables de entorno y desactiva `synchronize`.

### Instalación

Ejecuta los comandos en cada paquete:

```bash
# Backend
cd backend-clubhx
yarn install  # o npm install

# Frontend
cd ../frontend-clubhx
yarn install  # o npm install
```

### Ejecución en desarrollo

```bash
# 1) Backend (http://localhost:3001)
cd backend-clubhx
yarn start:dev  # recarga en caliente

# 2) Frontend (http://localhost:8080)
cd ../frontend-clubhx
yarn dev
```

Notas:
- CORS está habilitado en el backend para `http://localhost:8080` y `https://clubhx.com`.
- El frontend usa `API_BASE = "http://localhost:3001"` definido en `frontend-clubhx/src/lib/api.ts`.
  - Si necesitas apuntar a otra URL, ajusta ese archivo (hoy no lee `VITE_API_BASE`).

### Scripts útiles

- Backend (`backend-clubhx/package.json`):
  - `yarn build`: compilar a `dist/`
  - `yarn start`: iniciar
  - `yarn start:dev`: iniciar en modo watch
  - `yarn start:prod`: ejecutar `node dist/main`
  - `yarn test`, `yarn test:e2e`, `yarn test:cov`
  - `yarn lint`, `yarn format`

- Frontend (`frontend-clubhx/package.json`):
  - `yarn dev`: servidor de desarrollo Vite
  - `yarn build`: build de producción
  - `yarn preview`: previsualizar build
  - `yarn lint`: linting

### API y documentación

- Documentación Swagger disponible en `http://localhost:3001/docs` mientras el backend está corriendo.
- El proxy de Vite redirige `/api` al backend en desarrollo (ver `frontend-clubhx/vite.config.ts`).

### Producción (resumen)

- Backend:
  - Configura variables de entorno para la DB.
  - Compila: `yarn build` y ejecuta `yarn start:prod`.
- Frontend:
  - Compila: `yarn build`. Sirve `frontend-clubhx/dist` con tu servidor estático preferido.
  - Si el backend no está en `http://localhost:3001`, actualiza `src/lib/api.ts` antes de compilar.

### Solución de problemas

- Puertos en uso: cambia `PORT` del backend o `server.port` en `frontend-clubhx/vite.config.ts`.
- CORS: si cambias el origen del frontend, añade la URL en `backend-clubhx/src/main.ts` dentro de `app.enableCors({ origin: [...] })`.
- Conexión a PostgreSQL: verifica host, usuario, contraseña y que la base `clubhx` exista.


