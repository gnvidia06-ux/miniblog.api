const { Router } = require('express');
const service    = require('../services/authors.service');

const router = Router();

// GET /authors - listar todos los authors
router.get('/', async (req, res, next) => {
  try {
    const authors = await service.getAll();
    res.json(authors);
  } catch (err) {
    next(err);
  }
});

// GET /authors/:id - detalle de un author
router.get('/:id', async (req, res, next) => {
  try {
    const author = await service.getById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author no encontrado' });
    res.json(author);
  } catch (err) {
    next(err);
  }
});

// POST /authors - crear author
router.post('/', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    // Validaciones
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El campo name es obligatorio' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El campo email es obligatorio' });
    }

    const author = await service.create({ name: name.trim(), email: email.trim(), bio });
    res.status(201).json(author);
  } catch (err) {
    // Email duplicado (violación de unicidad en PostgreSQL)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }
    next(err);
  }
});

// PUT /authors/:id - actualizar author
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    // Al menos un campo debe venir para actualizar
    if (!name && !email && bio === undefined) {
      return res.status(400).json({ error: 'Debe enviar al menos un campo para actualizar' });
    }

    const author = await service.update(req.params.id, { name, email, bio });
    if (!author) return res.status(404).json({ error: 'Author no encontrado' });
    res.json(author);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }
    next(err);
  }
});

// DELETE /authors/:id - eliminar author
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Author no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
