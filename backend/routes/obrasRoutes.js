//routes/obrasRoutes.js
const express = require('express');
const router = express.Router();
const { inserirNovaObra, getObras, eliminarObras, atualizarObra, getObraId } = require('../controllers/obrasController');

router.get('/listarObras', getObras);
router.get('/listarObra/:id', getObraId);
router.post('/inserirNovaObra', inserirNovaObra); 
router.put('/atualizarObra/:id', atualizarObra);
router.delete('/eliminarObras', eliminarObras);

module.exports = router;