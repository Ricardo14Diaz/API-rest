const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const c = require('../controllers/productos.controller');

const router = Router();

// Públicas
router.get('/', c.listar);
router.get('/:id', c.obtener);

// Solo administrador
router.post('/', requireAuth, requireAdmin, c.crear);
router.put('/:id', requireAuth, requireAdmin, c.actualizar);
router.delete('/:id', requireAuth, requireAdmin, c.eliminar);

module.exports = router;