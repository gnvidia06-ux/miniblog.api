const { Router } = require('express');
const service    = require('../services/posts.service');
const authSvc    = require('../services/authors.service');

const router = Router();

// GET /posts - listar todos los posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await service.getAll();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/author/:authorId - posts de un author con detalle del author
// IMPORTANTE: esta ruta va ANTES de /:id para evitar conflicto de params
router.get('/author/:authorId', async (req, res, next) => {
  try {
    // Verificar que el author existe
    const author = await authSvc.getById(req.params.authorId);
    if (!author) return res.status(404).json({ error: 'Author no encontrado' });

    const posts = await service.getByAuthorId(req.params.authorId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/:id - detalle de un post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await service.getById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /posts - crear post
router.post('/', async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    // Validaciones
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El campo title es obligatorio' });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'El campo content es obligatorio' });
    }
    if (!author_id) {
      return res.status(400).json({ error: 'El campo author_id es obligatorio' });
    }

    // Verificar que el author existe
    const author = await authSvc.getById(author_id);
    if (!author) return res.status(404).json({ error: 'Author no encontrado' });

    const post = await service.create({ title: title.trim(), content, author_id, published });
    res.status(201).json(post);
  } catch (err) {
    // FK violation: author_id no existe en authors
    if (err.code === '23503') {
      return res.status(400).json({ error: 'El author_id no corresponde a ningún author' });
    }
    next(err);
  }
});

// PUT /posts/:id - actualizar post
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (!title && !content && !author_id && published === undefined) {
      return res.status(400).json({ error: 'Debe enviar al menos un campo para actualizar' });
    }

    // Si se cambia el author, verificar que existe
    if (author_id) {
      const author = await authSvc.getById(author_id);
      if (!author) return res.status(404).json({ error: 'Author no encontrado' });
    }

    const post = await service.update(req.params.id, { title, content, author_id, published });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'El author_id no corresponde a ningún author' });
    }
    next(err);
  }
});

// DELETE /posts/:id - eliminar post
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
