//routes/authroutes.js
const express = require('express');
const { register, login, updateProfile, deleteAccount } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/atualizarPerfil', verifyToken, updateProfile);
router.delete('/eliminarConta', verifyToken, deleteAccount);

module.exports = router;