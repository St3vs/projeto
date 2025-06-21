//routes/clientesroutes.js
const express = require('express');
const { getClienteById, criarFichaCliente, getClientes, eliminarClientes, atualizarCliente } = require('../controllers/clientesController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getCliente/:id', verifyToken, getClienteById);
router.get('/listarClientes', verifyToken, getClientes); 
router.post('/criarFichaCliente', verifyToken, criarFichaCliente);
router.put('/atualizarCliente/:id', verifyToken, atualizarCliente);
router.delete('/eliminarClientes', verifyToken, eliminarClientes);

module.exports = router;