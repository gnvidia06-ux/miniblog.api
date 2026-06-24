const express      = require('express');
const cors         = require('cors');
const authorsRoutes = require('./routes/authors.routes');
const postsRoutes   = require('./routes/posts.routes');
const errorHandler  = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MiniBlog API funcionando 🚀' });
});

// Rutas
app.use('/authors', authorsRoutes);
app.use('/posts',   postsRoutes);

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

// Middleware de errores (siempre al final)
app.use(errorHandler);

module.exports = app;
