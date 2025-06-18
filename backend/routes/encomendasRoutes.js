//routes/encomendasRoutes.js
const express = require('express');
const router = express.Router();
const { inserirNovaEncomenda, getEncomendas, eliminarEncomendas, atualizarEncomenda, getEncomendaId } = require('../controllers/encomendasController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/listarEncomendas', verifyToken, getEncomendas);
router.get('/listarEncomenda/:id', verifyToken, getEncomendaId);
router.post('/inserirNovaEncomenda', verifyToken, inserirNovaEncomenda); 
router.put('/atualizarEncomenda/:id', verifyToken, atualizarEncomenda);
router.delete('/eliminarEncomendas', verifyToken, eliminarEncomendas);

module.exports = router;