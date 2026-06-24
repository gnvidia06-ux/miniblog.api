-- ============================================================
-- MiniBlog API - Script de creación de tablas e índices
-- Ejecutar: psql -U <usuario> -d <base> -f sql/setup.sql
-- ============================================================

-- Eliminar tablas si existen (útil para reset)
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- Tabla authors
CREATE TABLE authors (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  bio        TEXT,
  created_at TIMESTAMPTZ   DEFAULT NOW()
);

-- Índice en email para búsquedas rápidas y unicidad
CREATE INDEX idx_authors_email ON authors(email);

-- Tabla posts
CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200)  NOT NULL,
  content    TEXT          NOT NULL,
  author_id  INTEGER       NOT NULL,
  published  BOOLEAN       DEFAULT FALSE,
  created_at TIMESTAMPTZ   DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Índice en author_id para queries de posts por autor
CREATE INDEX idx_posts_author_id ON posts(author_id);
