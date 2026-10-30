# octavo-backend

API REST de la tienda Octavo Zapatos, la Entrega 3 del curso. Sirve el catálogo (12 zapatos y 6 marcas de la Entrega 1), el registro y login de usuarios, y las reservas. Es la parte que habla con la base de datos; el sitio que la consume está en el repo `octavo-frontend`.

- API en producción: https://octavo-backend.onrender.com
- Sitio en producción: https://octavo-frontend.vercel.app

## Stack

Node.js, Express 5, TypeScript y Prisma 7 con PostgreSQL (Neon). La validación de entradas usa zod y las contraseñas se hashean con bcrypt; la sesión se firma como JWT.

El código está separado en cuatro capas y Prisma aparece solo en la última:

```
src/
├── domain/          entidades, tipos, interfaces de repositorios y errores de dominio
├── application/     casos de uso (depende solo del dominio)
├── infrastructure/  cliente Prisma, repositorios, bcrypt, JWT y lectura de variables de entorno
└── interface/http/  routers, controllers, middlewares y esquemas zod
```

Los controllers no tocan la base: reciben la petición (body, params y query ya validados), llaman al caso de uso y responden. En `src/index.ts` se conecta todo.

## Variables de entorno

Copia `.env.example` como `.env` y llena:

| Variable | Para qué sirve |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (Neon). Para `prisma migrate` debe ser la conexión directa, sin `-pooler` |
| `JWT_SECRET` | Secreto con el que se firman los tokens |
| `JWT_EXPIRES_IN` | Vencimiento del token (ej.: `1d`) |
| `PORT` | Puerto del servidor (opcional; Render lo define por ti) |
| `FRONTEND_URL` | URL del frontend habilitada en CORS (la de Vercel en producción) |

Si falta `DATABASE_URL`, `JWT_SECRET` o `JWT_EXPIRES_IN`, la aplicación no arranca y avisa cuál falta.

## Cómo correrlo en local

Tienes que tener Node 22.9 o superior y acceso a una base de datos PostgreSQL.

```bash
git clone <url-del-repo>
cd octavo-backend
npm install
npm run build    # prisma generate + prisma migrate deploy + tsc
npm run seed     # carga las marcas, zapatos y usuarios de prueba
npm run dev      # servidor en http://localhost:3000
```

El seed es idempotente y carga exactamente los datos de la Entrega 1 (los arreglos `marcas` y `zapatos` de `tienda-zapatos/script.js`), además de dos usuarios de prueba con la contraseña hasheada.

## Endpoints

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/health` | Público |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/zapatos?page=&limit=` | Público |
| GET | `/api/zapatos/:id` | Público |
| POST | `/api/zapatos` | Admin |
| PUT | `/api/zapatos/:id` | Admin |
| DELETE | `/api/zapatos/:id` | Admin |
| GET | `/api/marcas` | Público |
| POST | `/api/reservas` | Autenticado |
| GET | `/api/reservas/mias` | Autenticado |
| GET | `/api/reservas` | Admin |

El listado de zapatos responde `{ pagination, data }`, donde `pagination` es `{ page, limit, total, totalPages }`. Para crear o editar un zapato el body espera `nombre`, `categoria` (`running`, `casual` o `formal`), `precio`, `talla` (20 a 50), `descripcion`, `imagen` y `marcaId`.

Los errores tienen un formato único:

```json
{ "message": "texto", "errors": { "campo": "detalle" } }
```

Los 400 de validación traen el detalle por campo; el 409 de registro repetido trae `errors.email`; el 401 del login responde "Credenciales inválidas" en general, sin decir si falló el email o la contraseña.

Autenticación: el login entrega un JWT firmado con payload `{ id, role }`. Las peticiones autenticadas mandan el header `Authorization: Bearer <token>`; sin token, con token vencido o inválido la respuesta es 401, y con token válido pero sin permiso (no admin) es 403. Nunca se devuelve la contraseña; en las reservas el `userId` sale del token y no se acepta del body.

## Credenciales de prueba

El seed crea dos usuarios:

| Rol | Email | Contraseña |
| --- | --- | --- |
| admin | `admin@octavo.com` | `admin123` |
| user | `user@octavo.com` | `user123` |

## Cómo se probó

Además del lint y el typecheck, se verificó el flujo completo contra el despliegue de producción: catálogo público paginado, registro con repetido en 409, persistencia de la sesión, creaciones de reserva, la redirección de un `user` que entra a la vista de admin, y el par de respuestas de autorización (401 sin token y 403 con token de `user`) sobre `DELETE /api/zapatos/1`.

## Decisiones técnicas

*(Sección escrita por el autor: el flujo de un login con los archivos involucrados, dónde vive el token y su riesgo, los ejemplos de 401 y 403, y el uso que se le dio a la IA durante el desarrollo.)*