// Middleware global de manejo de errores
// Debe ser el ÚLTIMO middleware registrado en Express (4 parámetros)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('Error no manejado:', err.message);

  // Error de sintaxis en el JSON del body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el body de la petición' });
  }

  // Error genérico de base de datos
  if (err.code) {
    return res.status(500).json({ error: 'Error en la base de datos', detail: err.message });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;
