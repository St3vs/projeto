//server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const propostasRoutes = require('./routes/propostasRoutes');
const fornecedoresRoutes = require('./routes/fornecedoresRoutes');
const projetosRoutes = require('./routes/projetosRoutes');
const encomendasRoutes = require('./routes/encomendasRoutes');
const obrasRoutes = require('./routes/obrasRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authenticateToken = require('./middleware/authMiddleware');
require('dotenv').config();

const db = require('./models');

const sequelize = require('./config/config');

sequelize.sync(force="true") 
  .then(() => console.log('✅ Base de dadoss sincronizada'))
  .catch((err) => console.error('❌ Erro ao sincronizar DB:', err));

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.json({ message: 'Olá do Backend!' });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/clientes', authenticateToken, clientesRoutes);
app.use('/dashboard', authenticateToken, dashboardRoutes);
app.use('/propostas', authenticateToken, propostasRoutes);
app.use('/projetos', authenticateToken, projetosRoutes);
app.use('/fornecedores', authenticateToken, fornecedoresRoutes);
app.use('/encomendas', authenticateToken, encomendasRoutes);
app.use('/obras', authenticateToken, obrasRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor a rodar na porta ${PORT}`));
