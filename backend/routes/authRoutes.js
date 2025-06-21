//routes/authroutes.js
const express = require('express');
const { register, login, updateProfile, deleteAccount, fotoPerfil, getUser, upload  } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user', verifyToken, getUser);
router.post('/register', register);
router.post('/login', login);
router.put('/atualizarPerfil', verifyToken, updateProfile);
router.delete('/eliminarConta', verifyToken, deleteAccount);
router.post('/fotoPerfil', verifyToken, upload.single('image'), fotoPerfil);

module.exports = router;