const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const c = require('../controllers/productos.controller');

const router = Router();

router.get('/', c.listar);
router.get('/:id', c.obtener);

router.post('/', requireAuth, requireAdmin, c.crear);
router.put('/:id', requireAuth, requireAdmin, c.actualizar);
router.delete('/:id', requireAuth, requireAdmin, c.eliminar);

module.exports = router;