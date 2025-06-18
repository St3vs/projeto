//routes/obrasRoutes.js
const express = require('express');
const router = express.Router();
const { inserirNovaObra, getObras, eliminarObras, atualizarObra, getObraId } = require('../controllers/obrasController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/listarObras', verifyToken, getObras);
router.get('/listarObra/:id', verifyToken, getObraId);
router.post('/inserirNovaObra', verifyToken, inserirNovaObra); 
router.put('/atualizarObra/:id', verifyToken, atualizarObra);
router.delete('/eliminarObras', verifyToken, eliminarObras);

module.exports = router;