const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const c = require('../controllers/favoritos.controller');

const router = Router();

router.use(requireAuth);
router.get('/', c.listar);
router.post('/', c.agregar);
router.delete('/:productoId', c.quitar);

module.exports = router;