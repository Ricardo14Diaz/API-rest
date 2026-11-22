const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function requireAuth(req, res, next) {
  const match = (req.get('authorization') || '').match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Se requiere un token Bearer válido.' });
  }

  try {
    const payload = jwt.verify(match[1], jwtSecret, { algorithms: ['HS256'] });
    req.user = { id: Number(payload.sub), correo: payload.correo, rol: payload.rol };
    return next();
  } catch {
    return res.status(401).json({ error: 'El token es inválido o ha vencido.' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para realizar esta acción.' });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };