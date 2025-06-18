const express = require('express');
const { getProjetos, eliminarProjetos } = require('../controllers/projetosController'); // Criamos depois
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/listarProjetos', verifyToken, getProjetos); 
router.delete('/eliminarProjetos', verifyToken, eliminarProjetos); 

module.exports = router;