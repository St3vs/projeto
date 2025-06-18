const {User, sequelize} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
   cloudinary,
   params: {
      folder: 'profile_pictures',
      allowed_formats: ['jpg', 'jpeg', 'png'],
   },
});

const upload = multer({ storage });

exports.fotoPerfil = async (req, res) => {
   try {
      if (!req.file) return res.status(400).json({ error: 'Ficheiro não fornecido' });

      const userId = req.user.id;
      const imageUrl = req.file.path;

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

      user.fotoPerfil = imageUrl;
      await user.save();

      res.status(200).json({ message: 'Imagem de perfil atualizada', url: imageUrl });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao guardar imagem de perfil' });
   }
};

exports.getUser = async (req, res) => {
   try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

      res.status(200).json({ user });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar dados do utilizador' });
   }
};

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
      const token = jwt.sign(
         { id: user.id, email: user.email }, 
         process.env.JWT_SECRET,
         { expiresIn: '1d' }
      );


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

exports.updateProfile = async (req, res) => {
   try {
      const userId = req.user.id;
      const { username, contacto, nif } = req.body;

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

      user.username = username || user.username;
      user.contacto = contacto || user.contacto;
      user.nif = nif || user.nif;

      await user.save();

      res.json({ message: 'Perfil atualizado com sucesso', user });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar o perfil' });
   }
};

exports.deleteAccount = async (req, res) => {
   try {
      const userId = req.user.id;

      await sequelize.transaction(async (t) => {
         // Verifica se o utilizador existe
         const user = await User.findByPk(userId, { transaction: t });
         if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

         // Cria tabela de histórico se não existir
         await sequelize.query(`
         CREATE TABLE IF NOT EXISTS UsersEliminados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            contacto VARCHAR(255) UNIQUE,
            nif VARCHAR(255) UNIQUE,
            dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP
         );
         `, { transaction: t });

         // Copia o utilizador para a tabela de histórico
         await sequelize.query(`
         INSERT INTO UsersEliminados (username, email, password, contacto, nif)
         SELECT username, email, password, contacto, nif FROM Users WHERE id = ${userId};
         `, { transaction: t });

         // Apaga o utilizador original
         await User.destroy({ where: { id: userId }, transaction: t });

         // Recria tabela temporária para resetar os IDs
         await sequelize.query(`
         CREATE TABLE Users_temp (
            id INTEGER PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            contacto VARCHAR(255) UNIQUE,
            nif VARCHAR(255) UNIQUE
         );
         `, { transaction: t });

         // Copia os dados restantes renumerando IDs
         await sequelize.query(`
         INSERT INTO Users_temp (id, username, email, password, contacto, nif)
         SELECT ROW_NUMBER() OVER () AS id, username, email, password, contacto, nif FROM Users;
         `, { transaction: t });

         // Remove tabela antiga e renomeia a nova
         await sequelize.query(`DROP TABLE Users;`, { transaction: t });
         await sequelize.query(`ALTER TABLE Users_temp RENAME TO Users;`, { transaction: t });

         // Reseta o AUTOINCREMENT
         await sequelize.query(`DELETE FROM sqlite_sequence WHERE name='Users';`, { transaction: t });
      });

      res.json({ message: 'Conta eliminada com sucesso!' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao eliminar a conta' });
   }
};

exports.upload = upload;
