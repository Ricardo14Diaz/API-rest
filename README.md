# Catálogo API: productos y favoritos

API REST con Node.js, Express y PostgreSQL que gestiona un catálogo de productos y los favoritos personales de cada usuario. Usa autenticación JWT y autorización por roles (`usuario` y `admin`).

## Integrantes

- Ricardo Alexander Diaz Rivas (trabajo individual)

## Propósito

Demostrar una API con persistencia real, autenticación, autorización por roles y aislamiento de datos entre usuarios, con pruebas reproducibles en Postman.

## Elección de base de datos: PostgreSQL

Se eligió PostgreSQL porque el modelo es relacional (usuarios, productos y favoritos con claves foráneas) y permite garantizar la integridad con restricciones: correo único, `CHECK (precio > 0)`, clave primaria compuesta en favoritos (sin duplicados) y `ON DELETE CASCADE`. Todas las consultas son parametrizadas (`$1, $2...`).

**Favoritos al eliminar un producto:** se eliminan en cascada, de modo que no quedan favoritos huérfanos.

## Requisitos

- Node.js 20 o superior y npm
- PostgreSQL 14 o superior
- Postman

## Instalación

```bash
git clone https://github.com/Ricardo14Diaz/API-rest.git
cd API-rest
npm install
cp .env.example .env        # en PowerShell: Copy-Item .env.example .env
```

Crea la base de datos una sola vez:

```bash
psql -U postgres -c "CREATE DATABASE catalogo_db;"
```

## Variables de entorno (`.env`)

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (3000 por defecto) |
| `JWT_SECRET` | Secreto para firmar JWT (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | Vigencia del token (ej. `1h`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a PostgreSQL |
| `ADMIN_NOMBRE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Datos del administrador inicial (mínimo 8 caracteres de contraseña) |

`.env` está excluido de Git. Nunca subas valores reales.

## Inicialización de datos y del administrador

```bash
npm run db:init       # crea las tablas y carga 6 productos de ejemplo (solo si no hay productos)
npm run admin:crear   # crea el administrador con los datos de .env
```

El registro público siempre crea usuarios con rol `usuario`. El administrador solo se crea con este script local.

## Ejecución

```bash
npm start       # producción
npm run dev     # desarrollo con recarga (nodemon)
```

Servidor en `http://localhost:3000`.

## Rutas

Prefijo `/api`. Todas las respuestas son JSON. Los errores tienen la forma `{ "error": "mensaje" }`.

| Grupo | Método | Endpoint | Acceso | Solicitud | Respuesta correcta |
|:---|:---:|---|---|---|---|
| Auth | `POST` | `/api/auth/registro` | Público | `{ nombre, correo, password }` | `201` `{ usuario }` |
| Auth | `POST` | `/api/auth/login` | Público | `{ correo, password, rol }` (`usuario` o `admin`) | `200` `{ token, token_type, expires_in }` |
| Productos | `GET` | `/api/productos?categoria={categoria}` (opcional) | Público | - | `200` `{ productos }` |
| Productos | `GET` | `/api/productos/:id` | Público | - | `200` `{ producto }` |
| Productos | `POST` | `/api/productos` | Admin | `{ nombre, descripcion, categoria, precio }` | `201` `{ producto }` |
| Productos | `PUT` | `/api/productos/:id` | Admin | Uno o más campos del producto | `200` `{ producto }` |
| Productos | `DELETE` | `/api/productos/:id` | Admin | - | `204 No Content` |
| Favoritos | `GET` | `/api/favoritos` | Autenticado | - | `200` `{ favoritos }` |
| Favoritos | `POST` | `/api/favoritos` | Autenticado | `{ productoId }` (número) | `201 Created` |
| Favoritos | `DELETE` | `/api/favoritos/:productoId` | Autenticado | - | `204 No Content` |

Las rutas de administrador y autenticadas requieren `Authorization: Bearer <token>`.

En el login, `rol` debe coincidir con el rol guardado para esa cuenta: usa `"rol": "admin"` para el administrador y `"rol": "usuario"` para una cuenta normal. Este campo no asigna ni eleva permisos; el token siempre obtiene el rol de la base de datos.

El registro público no recibe el campo `rol`: crea siempre cuentas `usuario`. Las cuentas administradoras se crean únicamente mediante `npm run admin:crear`.

**Criterio de códigos de error:** 400 para cuerpo inválido, campos vacíos o faltantes, campos no permitidos, precio inválido o id mal formado; 401 para token ausente, inválido o vencido, credenciales incorrectas o rol que no coincide; 403 para rol insuficiente; 404 para recursos inexistentes; 409 para duplicados. No se usa 422.

**Seguridad:** las contraseñas se guardan con bcrypt y nunca se devuelven. La identidad en favoritos sale del token verificado, no del cliente. El mismo mensaje de error en login no revela si falló el correo o la contraseña.

## Pruebas en Postman

1. Importa `postman/catalogo-api.postman_collection.json` y `postman/catalogo-api.postman_environment.json`.
2. En el entorno completa `admin_password` con el valor de `ADMIN_PASSWORD`. Este valor va solo en tu copia local.
3. Con el servidor iniciado, ejecuta las carpetas 1 a 5 en orden (Runner > Run collection).
4. Reinicia Node.js (`Ctrl+C` y `npm start`) y ejecuta la carpeta 6 para evidenciar la persistencia.

Casos cubiertos: registro y login de usuario, login de admin, consulta pública de productos, CRUD de productos como admin, 401 sin token, 403 con rol usuario, agregar y consultar favoritos, eliminación de producto con borrado en cascada de favoritos y persistencia tras reiniciar.
