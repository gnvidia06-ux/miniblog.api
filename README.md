# MiniBlog API 📝

API REST para gestión de autores y publicaciones, desarrollada con **Node.js + Express + PostgreSQL**.

---

## Descripción

MiniBlog API es el backend del servicio de contenidos de DevSpark. Permite crear, leer, actualizar y eliminar autores y posts, con validaciones, manejo de errores centralizado, tests automatizados y documentación OpenAPI.

**Entidades:**
- `authors`: id, name, email, bio, created_at
- `posts`: id, title, content, author_id (FK), published, created_at

---

## Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm

---

## Ejecutar localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/miniblog-api.git
cd miniblog-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de PostgreSQL:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=postgres
DB_PASSWORD=tu_password
```

### 4. Crear la base de datos y ejecutar los scripts SQL

```bash
# Crear la base de datos (si no existe)
createdb miniblog

# Crear tablas
psql -U postgres -d miniblog -f sql/setup.sql

# Cargar datos de ejemplo
psql -U postgres -d miniblog -f sql/seed.sql
```

### 5. Iniciar el servidor

```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start
```

La API estará disponible en `http://localhost:3000`.

---

## Endpoints disponibles

| Método | Ruta                       | Descripción                        |
|--------|----------------------------|------------------------------------|
| GET    | /authors                   | Listar todos los authors           |
| GET    | /authors/:id               | Obtener un author por ID           |
| POST   | /authors                   | Crear un author                    |
| PUT    | /authors/:id               | Actualizar un author               |
| DELETE | /authors/:id               | Eliminar un author                 |
| GET    | /posts                     | Listar todos los posts             |
| GET    | /posts/:id                 | Obtener un post por ID             |
| GET    | /posts/author/:authorId    | Posts de un author con su detalle  |
| POST   | /posts                     | Crear un post                      |
| PUT    | /posts/:id                 | Actualizar un post                 |
| DELETE | /posts/:id                 | Eliminar un post                   |

---

## Ejecutar los tests

Los tests usan **Jest + Supertest** y mockean la base de datos (no requieren PostgreSQL):

```bash
npm test
```

Cobertura mínima incluida:
- Crear author (201) y validaciones (400)
- Obtener author existente (200) e inexistente (404)
- Email duplicado (400)
- Crear post válido (201) y con campos faltantes (400)
- Eliminar recurso existente (204) e inexistente (404)
- Posts por author con JOIN

---

## Documentación OpenAPI

El archivo `openapi.yaml` contiene la especificación completa de la API.

Para visualizarla localmente con Swagger UI:

```bash
# Opción 1: extensión de VS Code "OpenAPI (Swagger) Editor"
# Abrir openapi.yaml y usar el preview integrado

# Opción 2: usando npx
npx @redocly/cli preview-docs openapi.yaml

# Opción 3: subir openapi.yaml a https://editor.swagger.io
```

---

## Deploy en Railway

### Pasos

1. Crear cuenta en [Railway](https://railway.app)
2. Crear un nuevo proyecto → **Deploy from GitHub repo**
3. Seleccionar este repositorio
4. En el mismo proyecto, agregar un servicio **PostgreSQL** (New → Database → PostgreSQL)
5. En el servicio de la app, ir a **Variables** y configurar:

| Variable      | Valor                                                      |
|---------------|------------------------------------------------------------|
| NODE_ENV      | production                                                 |
| DATABASE_URL  | (copiar desde el servicio PostgreSQL → Connect → Database URL interna) |

6. Railway detecta automáticamente el comando `npm start`
7. Una vez desplegado, ir a **Settings → Networking** y generar un dominio público

### Ejecutar los scripts SQL en Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Vincular proyecto
railway link

# Correr setup y seed contra la BD de Railway
railway run psql $DATABASE_URL -f sql/setup.sql
railway run psql $DATABASE_URL -f sql/seed.sql
```

### Variables de entorno en Railway

| Variable     | Descripción                                  |
|--------------|----------------------------------------------|
| DATABASE_URL | URL de conexión (Railway la provee automáticamente al vincular PostgreSQL) |
| NODE_ENV     | `production`                                 |
| PORT         | Railway la asigna automáticamente            |

---

## Estructura del proyecto

```
miniblog-api/
├── src/
│   ├── app.js                    # App Express (sin listen)
│   ├── index.js                  # Punto de entrada (listen)
│   ├── db/
│   │   └── pool.js               # Pool de conexiones PostgreSQL
│   ├── routes/
│   │   ├── authors.routes.js     # Rutas y controladores de authors
│   │   └── posts.routes.js       # Rutas y controladores de posts
│   ├── services/
│   │   ├── authors.service.js    # Queries SQL de authors
│   │   └── posts.service.js      # Queries SQL de posts
│   └── middlewares/
│       └── errorHandler.js       # Middleware global de errores
├── sql/
│   ├── setup.sql                 # Creación de tablas e índices
│   └── seed.sql                  # Datos de ejemplo
├── tests/
│   └── api.test.js               # Tests con Jest + Supertest
├── openapi.yaml                  # Documentación OpenAPI 3.0
├── .env.example                  # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── README.md
```

---

## Registro de uso de IA

Este proyecto fue desarrollado con asistencia de Claude (Anthropic) como herramienta de apoyo:

- **Generación de estructura base**: Se utilizó IA para generar el scaffolding inicial del proyecto (estructura de carpetas, archivos base de Express, configuración de pg).
- **Revisión de queries SQL**: Las consultas parametrizadas y el JOIN de posts con authors fueron revisados y ajustados con asistencia de IA.
- **Tests con mocks**: La estrategia de mockear el pool de pg para no depender de una BD real en los tests fue sugerida por la IA.
- **Documentación OpenAPI**: El esquema YAML fue generado con asistencia de IA a partir de los endpoints definidos.

Todo el código fue revisado, comprendido y validado manualmente antes de su inclusión en el proyecto.
