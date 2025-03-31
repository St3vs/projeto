//server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
//const connectDB = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const propostasRoutes = require('./routes/propostasRoutes');
const fornecedoresRoutes = require('./routes/fornecedoresRoutes');
const projetosRoutes = require('./routes/projetosRoutes');
/*
require('dotenv').config();
connectDB();
*/

const sequelize = require('./config/config');

sequelize.sync() // Cria tabelas automaticamente se não existirem
  .then(() => console.log('✅ Base de dadoss sincronizada'))
  .catch((err) => console.error('❌ Erro ao sincronizar DB:', err));

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rotas
app.use('/auth', authRoutes);
app.use('/clientes', clientesRoutes);
app.use('/propostas', propostasRoutes);
app.use('/projetos', projetosRoutes);
app.use('/fornecedores', fornecedoresRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor a rodar na porta ${PORT}`));
