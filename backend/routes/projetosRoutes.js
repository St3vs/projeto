const express = require('express');
const { getProjetos, eliminarProjetos } = require('../controllers/projetosController'); // Criamos depois

const router = express.Router();

router.get('/listarProjetos', getProjetos); 
router.delete('/eliminarProjetos', eliminarProjetos); 

module.exports = router;