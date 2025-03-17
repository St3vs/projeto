//routes/clientesroutes.js
const express = require('express');
const { criarFichaCliente, getClientes, eliminarClientes } = require('../controllers/clientesController');

const router = express.Router();

router.post('/criarFichaCliente', criarFichaCliente);
router.get('/listarClientes', getClientes); 
router.delete('/eliminarClientes', eliminarClientes);

module.exports = router;