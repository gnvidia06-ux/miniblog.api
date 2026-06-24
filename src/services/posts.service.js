const pool = require('../db/pool');

// Obtener todos los posts
const getAll = async () => {
  const result = await pool.query(
    'SELECT * FROM posts ORDER BY created_at DESC'
  );
  return result.rows;
};

// Obtener un post por ID
const getById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM posts WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Obtener posts de un author con datos del author (JOIN)
const getByAuthorId = async (authorId) => {
  const result = await pool.query(
    `SELECT
       p.id,
       p.title,
       p.content,
       p.published,
       p.created_at,
       a.id         AS author_id,
       a.name       AS author_name,
       a.email      AS author_email,
       a.bio        AS author_bio
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC`,
    [authorId]
  );
  return result.rows;
};

// Crear un post
const create = async ({ title, content, author_id, published }) => {
  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, author_id, published ?? false]
  );
  return result.rows[0];
};

// Actualizar un post
const update = async (id, { title, content, author_id, published }) => {
  const result = await pool.query(
    `UPDATE posts
     SET title     = COALESCE($1, title),
         content   = COALESCE($2, content),
         author_id = COALESCE($3, author_id),
         published = COALESCE($4, published)
     WHERE id = $5
     RETURNING *`,
    [title || null, content || null, author_id || null, published ?? null, id]
  );
  return result.rows[0] || null;
};

// Eliminar un post
const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { getAll, getById, getByAuthorId, create, update, remove };
