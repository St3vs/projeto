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

      if (!ids && id) ids = [id];
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhum fornecedor selecionado para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Criação da tabela de histórico, se ainda não existir
         await sequelize.query(`
            CREATE TABLE IF NOT EXISTS FornecedoresEliminados (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               username VARCHAR(255) NOT NULL UNIQUE,
               email VARCHAR(255) NOT NULL UNIQUE,
               contacto VARCHAR(255) NOT NULL UNIQUE,
               nif VARCHAR(255) NOT NULL UNIQUE,
               dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
         `, { transaction: t });

         // Copia os dados dos fornecedores eliminados para a tabela de histórico
         await sequelize.query(`
            INSERT INTO FornecedoresEliminados (username, email, contacto, nif)
            SELECT username, email, contacto, nif
            FROM Fornecedores
            WHERE id IN (${ids.join(',')});
         `, { transaction: t });

         // Remove os fornecedores da tabela principal
         await sequelize.query(`
            DELETE FROM Fornecedores WHERE id IN (${ids.join(',')});
         `, { transaction: t });

         // Cria uma tabela temporária com os mesmos campos e reinicia IDs
         await sequelize.query(`
            CREATE TABLE Fornecedores_temp (
               id INTEGER PRIMARY KEY,
               username VARCHAR(255) NOT NULL UNIQUE,
               email VARCHAR(255) NOT NULL UNIQUE,
               contacto VARCHAR(255) NOT NULL UNIQUE,
               nif VARCHAR(255) NOT NULL UNIQUE
            );
         `, { transaction: t });

         // Reinsere os dados restantes com IDs reordenados
         await sequelize.query(`
            INSERT INTO Fornecedores_temp (id, username, email, contacto, nif)
            SELECT ROW_NUMBER() OVER () AS id, username, email, contacto, nif
            FROM Fornecedores;
         `, { transaction: t });

         // Substitui a tabela antiga pela nova
         await sequelize.query(`DROP TABLE Fornecedores;`, { transaction: t });
         await sequelize.query(`ALTER TABLE Fornecedores_temp RENAME TO Fornecedores;`, { transaction: t });

         // Limpa o autoincremento
         await sequelize.query(`DELETE FROM sqlite_sequence WHERE name='Fornecedores';`, { transaction: t });
      });

      res.status(200).json({ message: "Fornecedores eliminados com sucesso! IDs resetados." });

   } catch (error) {
      console.error("Erro ao eliminar fornecedores:", error);
      res.status(500).json({ error: "Erro ao eliminar fornecedores" });
   }
};



