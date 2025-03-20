/* controllers/fornecedoresController.js
const Fornecedor = require('../models/fornecedores');

exports.criarFichaFornecedor = async (req, res) => {
   try {
      const { username, email, contacto, nif } = req.body;

      // Verifica se o fornecedor já tem ficha
      const fornecedorExists = await Fornecedor.findOne({ email });
      if (fornecedorExists) {
         return res.status(400).json({ error: 'Um fornecedor com esse mail já se encontra registado!' });
      }

      // Criar novo fornecedor
      const fornecedor = new Fornecedor({ username, email, contacto, nif });
      await fornecedor.save();

      res.status(201).json({ message: 'Ficha criada com sucesso!' });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ficha de fornecedor' });
   }
};

exports.getFornecedores = async (req, res) => {
   try {
      const fornecedores = await Fornecedor.find();
      res.status(200).json(fornecedores);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de fornecedores' });
   }
};

exports.eliminarFornecedores = async (req, res) => {
   try {
      const { ids } = req.body;

      // Verifica se IDs foram fornecidos
      if (!ids || ids.length === 0) {
         return res.status(400).json({ error: "Nenhum fornecedor selecionado para exclusão" });
      }

      // Elimina o/os fornecedores selecionado/os na base de dados
      await Fornecedor.deleteMany({ _id: { $in: ids } });

      res.status(200).json({ message: "Fornecedor/es eliminado/os com sucesso!" });
   } catch (error) {
      res.status(500).json({ error: "Erro ao eliminar fornecedores" });
   }
};
*/
const { Sequelize } = require('sequelize');
const sequelize = require('../config/config');
const Fornecedor = require('../models/fornecedores');

exports.criarFichaFornecedor = async (req, res) => {
   try {
      const { username, email, contacto, nif } = req.body;

      const fornecedorExists = await Fornecedor.findOne({ where: { email } });
      if (fornecedorExists) {
         return res.status(400).json({ error: 'Um fornecedor com esse email já existe!' });
      }

      const fornecedor = await Fornecedor.create({ username, email, contacto, nif });

      res.status(201).json({ message: 'Ficha criada com sucesso!', fornecedor });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ficha de fornecedor' });
   }
};

exports.getFornecedores = async (req, res) => {
   try {
      const fornecedores = await Fornecedor.findAll();
      res.status(200).json(fornecedores);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de fornecedores' });
   }
};

exports.eliminarFornecedores = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Se apenas um ID for enviado, convertemos para array
      if (!ids && id) {
         ids = [id];
      }

      // Garantir que `ids` é um array de inteiros e remover valores inválidos
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhum fornecedor selecionado para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Deletar fornecedores pelos IDs fornecidos
         await sequelize.query(`DELETE FROM Fornecedores WHERE id IN (${ids.join(",")});`, { transaction: t });

         // Criar uma nova tabela temporária sem AUTOINCREMENT
         await sequelize.query(`
            CREATE TABLE Fornecedores_temp (
               id INTEGER PRIMARY KEY, 
               username VARCHAR(255) NOT NULL UNIQUE,
               email VARCHAR(255) NOT NULL UNIQUE,
               contacto VARCHAR(255) NOT NULL UNIQUE,
               nif VARCHAR(255) NOT NULL UNIQUE
            );
         `, { transaction: t });

         // Copiar os dados para a tabela temporária e reordenar os IDs
         await sequelize.query(`
            INSERT INTO Fornecedores_temp (id, username, email, contacto, nif)
            SELECT ROW_NUMBER() OVER (ORDER BY id) AS id, username, email, contacto, nif FROM Fornecedores;
         `, { transaction: t });

         // Excluir a tabela original
         await sequelize.query("DROP TABLE Fornecedores;", { transaction: t });

         // Renomear a tabela temporária para o nome original
         await sequelize.query("ALTER TABLE Fornecedores_temp RENAME TO Fornecedores;", { transaction: t });

         // Resetar o AUTOINCREMENT
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Fornecedores';", { transaction: t });
      });

      res.status(200).json({ message: "Fornecedores eliminados e IDs resetados com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar fornecedores:", error);
      res.status(500).json({ error: "Erro ao eliminar fornecedores" });
   }
};

