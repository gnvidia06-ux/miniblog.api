-- ============================================================
-- MiniBlog API - Datos de ejemplo (seed)
-- Ejecutar DESPUÉS de setup.sql
-- Ejecutar: psql -U <usuario> -d <base> -f sql/seed.sql
-- ============================================================

INSERT INTO authors (name, email, bio) VALUES
  ('Ana García',   'ana@example.com',    'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz',  'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
  ('María López',  'maria@example.com',  'Ingeniera de software con foco en APIs REST');

INSERT INTO posts (title, content, author_id, published) VALUES
  ('Introducción a Node.js',       'Node.js es un runtime de JavaScript construido sobre el motor V8 de Chrome. Permite ejecutar JavaScript del lado del servidor con un modelo de I/O no bloqueante.',       1, true),
  ('PostgreSQL vs MySQL',          'Ambas bases de datos tienen ventajas y desventajas. PostgreSQL destaca por su cumplimiento con el estándar SQL y sus tipos de datos avanzados.',                         2, true),
  ('APIs RESTful',                 'REST es un estilo arquitectónico para sistemas distribuidos. Define restricciones como la interfaz uniforme, la ausencia de estado y la arquitectura cliente-servidor.', 1, true),
  ('Manejo de errores en Express', 'El manejo apropiado de errores en Express se logra con middlewares de 4 parámetros (err, req, res, next) que centralizan la lógica de respuesta ante fallos.',          3, false),
  ('Async/Await explicado',        'Las promesas simplifican el código asíncrono. Async/await es azúcar sintáctico sobre promesas que hace el código más legible y fácil de depurar.',                      1, false);
