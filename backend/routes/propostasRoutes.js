const express = require('express');
const router = express.Router();
const { inserirNovaProposta, getPropostas, eliminarPropostas, atualizarProposta, getPropostaId } = require('../controllers/propostasController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/listarPropostas', verifyToken, getPropostas);
router.get('/listarProposta/:id', verifyToken, getPropostaId);
router.post('/inserirNovaProposta', verifyToken, inserirNovaProposta); 
router.put('/atualizarProposta/:id', verifyToken, atualizarProposta);
router.delete('/eliminarPropostas', verifyToken, eliminarPropostas);

module.exports = router;