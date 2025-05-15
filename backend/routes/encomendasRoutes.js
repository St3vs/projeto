//routes/encomendasRoutes.js
const express = require('express');
const router = express.Router();
const { inserirNovaEncomenda, getEncomendas, eliminarEncomendas, atualizarEncomenda, getEncomendaId } = require('../controllers/encomendasController');

router.get('/listarEncomendas', getEncomendas);
router.get('/listarEncomenda/:id', getEncomendaId);
router.post('/inserirNovaEncomenda', inserirNovaEncomenda); 
router.put('/atualizarEncomenda/:id', atualizarEncomenda);
router.delete('/eliminarEncomendas', eliminarEncomendas);

module.exports = router;