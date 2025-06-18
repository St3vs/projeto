//routes/clientesroutes.js
const express = require('express');
const { criarFichaCliente, getClientes, eliminarClientes } = require('../controllers/clientesController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/criarFichaCliente', verifyToken, criarFichaCliente);
router.get('/listarClientes', verifyToken, getClientes); 
router.delete('/eliminarClientes', verifyToken, eliminarClientes);

module.exports = router;