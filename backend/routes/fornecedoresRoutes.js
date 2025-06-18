//routes/fornecedoresRoutes.js
const express = require('express');
const { criarFichaFornecedor, getFornecedores, eliminarFornecedores } = require('../controllers/fornecedoresController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/criarFichaFornecedor', verifyToken, criarFichaFornecedor);
router.get('/listarFornecedores', verifyToken, getFornecedores); 
router.delete('/eliminarFornecedores', verifyToken, eliminarFornecedores);

module.exports = router;