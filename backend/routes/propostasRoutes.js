//routes/clientesroutes.js
const express = require('express');
const { inserirNovaProposta, getPropostas, eliminarPropostas } = require('../controllers/propostasController');

const router = express.Router();

router.post('/inserirNovaProposta', inserirNovaProposta);
router.get('/listarPropostas', getPropostas); 
router.delete('/eliminarPropostas', eliminarPropostas);

module.exports = router;