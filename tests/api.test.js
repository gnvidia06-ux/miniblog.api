/**
 * Tests de integración con supertest
 * Se mockea el pool de PostgreSQL para no necesitar una BD real en CI
 */

const request = require('supertest');

// ─── Mock del pool de pg ───────────────────────────────────────────────────
// Interceptamos antes de cargar app para que los services usen el mock
const mockQuery = jest.fn();
jest.mock('../src/db/pool', () => ({
  query:   mockQuery,
  connect: (cb) => cb(null, { release: jest.fn() }, jest.fn()),
}));

const app = require('../src/app');

// ─── Datos de ejemplo ─────────────────────────────────────────────────────
const fakeAuthor = {
  id: 1,
  name: 'Ana García',
  email: 'ana@example.com',
  bio: 'Dev full-stack',
  created_at: new Date().toISOString(),
};

const fakePost = {
  id: 1,
  title: 'Introducción a Node.js',
  content: 'Node.js es un runtime...',
  author_id: 1,
  published: true,
  created_at: new Date().toISOString(),
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const dbReturns = (rows) => mockQuery.mockResolvedValueOnce({ rows });
const dbFails   = (err)  => mockQuery.mockRejectedValueOnce(err);

// ─────────────────────────────────────────────────────────────────────────
// AUTHORS
// ─────────────────────────────────────────────────────────────────────────
describe('AUTHORS', () => {
  beforeEach(() => mockQuery.mockClear());

  // GET /authors
  test('GET /authors → 200 con lista de authors', async () => {
    dbReturns([fakeAuthor]);
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].email).toBe(fakeAuthor.email);
  });

  // GET /authors/:id - encontrado
  test('GET /authors/:id → 200 cuando existe', async () => {
    dbReturns([fakeAuthor]);
    const res = await request(app).get('/authors/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  // GET /authors/:id - no encontrado
  test('GET /authors/:id → 404 cuando no existe', async () => {
    dbReturns([]); // sin resultados
    const res = await request(app).get('/authors/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  // POST /authors - creación exitosa
  test('POST /authors → 201 al crear author válido', async () => {
    dbReturns([fakeAuthor]);
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Ana García', email: 'ana@example.com', bio: 'Dev' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Ana García');
  });

  // POST /authors - nombre vacío
  test('POST /authors → 400 si name está vacío', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: '', email: 'test@test.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  // POST /authors - email vacío
  test('POST /authors → 400 si email está vacío', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Test', email: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  // POST /authors - email duplicado
  test('POST /authors → 400 si email ya existe', async () => {
    const dupError = new Error('duplicate key');
    dupError.code = '23505';
    dbFails(dupError);
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Otro', email: 'ana@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  // PUT /authors/:id
  test('PUT /authors/:id → 200 al actualizar', async () => {
    dbReturns([{ ...fakeAuthor, name: 'Ana Actualizada' }]);
    const res = await request(app)
      .put('/authors/1')
      .send({ name: 'Ana Actualizada' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Ana Actualizada');
  });

  // PUT /authors/:id - no existe
  test('PUT /authors/:id → 404 cuando no existe', async () => {
    dbReturns([]);
    const res = await request(app)
      .put('/authors/999')
      .send({ name: 'X' });
    expect(res.status).toBe(404);
  });

  // DELETE /authors/:id - exitoso
  test('DELETE /authors/:id → 204 al eliminar', async () => {
    dbReturns([{ id: 1 }]);
    const res = await request(app).delete('/authors/1');
    expect(res.status).toBe(204);
  });

  // DELETE /authors/:id - no existe
  test('DELETE /authors/:id → 404 cuando no existe', async () => {
    dbReturns([]);
    const res = await request(app).delete('/authors/999');
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────────────────────────────────
describe('POSTS', () => {
  beforeEach(() => mockQuery.mockClear());

  // GET /posts
  test('GET /posts → 200 con lista de posts', async () => {
    dbReturns([fakePost]);
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET /posts/:id - encontrado
  test('GET /posts/:id → 200 cuando existe', async () => {
    dbReturns([fakePost]);
    const res = await request(app).get('/posts/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(fakePost.title);
  });

  // GET /posts/:id - no encontrado
  test('GET /posts/:id → 404 cuando no existe', async () => {
    dbReturns([]);
    const res = await request(app).get('/posts/999');
    expect(res.status).toBe(404);
  });

  // GET /posts/author/:authorId
  test('GET /posts/author/:authorId → 200 con posts del author', async () => {
    dbReturns([fakeAuthor]);   // getById del author
    dbReturns([fakePost]);     // getByAuthorId
    const res = await request(app).get('/posts/author/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET /posts/author/:authorId - author no existe
  test('GET /posts/author/:authorId → 404 si author no existe', async () => {
    dbReturns([]); // author no encontrado
    const res = await request(app).get('/posts/author/999');
    expect(res.status).toBe(404);
  });

  // POST /posts - exitoso
  test('POST /posts → 201 al crear post válido', async () => {
    dbReturns([fakeAuthor]); // verificar author
    dbReturns([fakePost]);   // crear post
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Test', content: 'Contenido', author_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body.title).toBeDefined();
  });

  // POST /posts - title vacío
  test('POST /posts → 400 si title está vacío', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: '', content: 'Algo', author_id: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  // POST /posts - content vacío
  test('POST /posts → 400 si content está vacío', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Test', content: '', author_id: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/content/i);
  });

  // POST /posts - sin author_id
  test('POST /posts → 400 si author_id falta', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Test', content: 'Algo' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/author_id/i);
  });

  // POST /posts - author no existe
  test('POST /posts → 404 si author_id no existe', async () => {
    dbReturns([]); // author no encontrado
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Test', content: 'Algo', author_id: 999 });
    expect(res.status).toBe(404);
  });

  // DELETE /posts/:id - exitoso
  test('DELETE /posts/:id → 204 al eliminar', async () => {
    dbReturns([{ id: 1 }]);
    const res = await request(app).delete('/posts/1');
    expect(res.status).toBe(204);
  });

  // DELETE /posts/:id - no existe
  test('DELETE /posts/:id → 404 cuando no existe', async () => {
    dbReturns([]);
    const res = await request(app).delete('/posts/999');
    expect(res.status).toBe(404);
  });
});
