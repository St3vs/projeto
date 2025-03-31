//routes/clientesroutes.js
const express = require('express');
const router = express.Router();
const { inserirNovaProposta, getPropostas, eliminarPropostas, atualizarProposta, getPropostaId } = require('../controllers/propostasController');

router.get('/listarPropostas', getPropostas);
router.get('/listarProposta/:id', getPropostaId);
router.post('/inserirNovaProposta', inserirNovaProposta); 
router.put('/atualizarProposta/:id', atualizarProposta);
router.delete('/eliminarPropostas', eliminarPropostas);

module.exports = router;