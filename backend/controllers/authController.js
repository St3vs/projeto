const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
   try {
      const { username, email, password, contacto, nif } = req.body;

      // Verifica se o utilizador já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
         return res.status(400).json({ error: 'Email já registado!' });
      }

      // Hash da senha antes de guardar
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar novo utilizador
      const user = await User.create({ username, email, password: hashedPassword, contacto, nif });

      res.status(201).json({ message: 'Utilizador registado com sucesso!' });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao registar o utilizador' });
   }
};

exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Verifica se o utilizador existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
         return res.status(400).json({ error: "Utilizador não encontrado" });
      }

      // Comparar a senha fornecida com a senha armazenada
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ error: 'Senha incorreta!' });
      }

      // Criar o token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });


      res.status(200).json({
         token,
         user: {
               username: user.username,
               email: user.email,
               contacto: user.contacto,
               nif: user.nif,            
         },
      });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' });
   }
};
