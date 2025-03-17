//routes/fornecedoresRoutes.js
const express = require('express');
const { criarFichaFornecedor, getFornecedores, eliminarFornecedores } = require('../controllers/fornecedoresController');

const router = express.Router();

router.post('/criarFichaFornecedor', criarFichaFornecedor);
router.get('/listarFornecedores', getFornecedores); 
router.delete('/eliminarFornecedores', eliminarFornecedores);

module.exports = router;