# MiniBlog API

API REST para gestionar autores y posts, hecha con Node.js, Express y PostgreSQL.

---

## ¿Qué es esto?

Es el proyecto integrador del módulo de backend de Soy Henry. La idea era construir una API funcional conectada a una base de datos real, con validaciones, tests y documentación.

Tiene dos entidades principales:
- `authors`: los autores, con nombre, email y bio
- `posts`: las publicaciones, cada una asociada a un autor

---

## Para correrlo localmente

### Lo que necesitás tener instalado

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

### Pasos

1. Clonar el repositorio

```bash
git clone https://github.com/gnvidia06-ux/miniblog.api.git
cd miniblog.api
```

2. Instalar dependencias

```bash
npm install
```

3. Crear el archivo de variables de entorno

```bash
cp .env.example .env
```

Editarlo con tus datos de PostgreSQL:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=postgres
DB_PASSWORD=tu_password
```

4. Crear las tablas y cargar datos de ejemplo

```bash
psql -U postgres -d miniblog -f sql/setup.sql
psql -U postgres -d miniblog -f sql/seed.sql
```

5. Levantar el servidor

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000`.

---

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /authors | Listar autores |
| GET | /authors/:id | Ver un autor |
| POST | /authors | Crear autor |
| PUT | /authors/:id | Actualizar autor |
| DELETE | /authors/:id | Eliminar autor |
| GET | /posts | Listar posts |
| GET | /posts/:id | Ver un post |
| GET | /posts/author/:authorId | Posts de un autor |
| POST | /posts | Crear post |
| PUT | /posts/:id | Actualizar post |
| DELETE | /posts/:id | Eliminar post |

---

## Tests

```bash
npm test
```

No necesitan PostgreSQL instalado porque mockean la base de datos. Hay 23 tests que cubren los casos principales de cada endpoint.

---

## Documentación OpenAPI

El archivo `openapi.yaml` tiene la especificación completa. Para visualizarla podés subirla a https://editor.swagger.io o usar la extensión "OpenAPI (Swagger) Editor" en VS Code.

---

## Deploy

Está deployada en Railway:
`https://miniblogapi-production-ba54.up.railway.app`

---

## Estructura

```
miniblog-api/
├── src/
│   ├── app.js
│   ├── index.js
│   ├── db/
│   │   └── pool.js
│   ├── routes/
│   │   ├── authors.routes.js
│   │   └── posts.routes.js
│   ├── services/
│   │   ├── authors.service.js
│   │   └── posts.service.js
│   └── middlewares/
│       └── errorHandler.js
├── sql/
│   ├── setup.sql
│   └── seed.sql
├── tests/
│   └── api.test.js
├── openapi.yaml
└── .env.example
```