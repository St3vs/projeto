//routes/fornecedoresRoutes.js
const express = require('express');
const { criarFichaFornecedor, getFornecedores, eliminarFornecedores, atualizarFornecedor, getFornecedorById } = require('../controllers/fornecedoresController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/listarFornecedores', verifyToken, getFornecedores);
router.get('/getFornecedor/:id', verifyToken, getFornecedorById);
router.post('/criarFichaFornecedor', verifyToken, criarFichaFornecedor) 
router.put('/atualizarFornecedor/:id', verifyToken, atualizarFornecedor); 
router.delete('/eliminarFornecedores', verifyToken, eliminarFornecedores);

module.exports = router;