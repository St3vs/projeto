const sequelize = require('../config/config');
const Obra = require('../models/obras');
const { Projeto } = require('../models');

exports.getObras = async (req, res) => {
   try {
      const obras = await Obra.findAll({
      include: [{
         model: Projeto,
         as: 'projeto',
         attributes: ['id', 'clienteId', 'assunto']
      }],
      attributes: ['id', 'projetoId', 'descricao', 'data', 'valorProposta', 'valorFaturado', 'dataUltimaFatura']
      });
      res.status(200).json(obras);
   } catch (error) {
      console.error("Erro ao obter lista de obras:", error);
      res.status(500).json({ error: 'Erro ao obter lista de obras' });
   }
};

exports.getObraId = async (req, res) => {
   try {
      const { id } = req.params;

      const obra = await Obra.findByPk(id, {
         include: [{
            model: Projeto,
            as: 'projeto',
            attributes: ['id', 'clienteId', 'assunto']
         }],
         attributes: ['id', 'projetoId', 'descricao', 'data', 'valorProposta', 'valorFaturado', 'dataUltimaFatura']
      });

      if (!obra) {
         return res.status(404).json({ error: "Obra não encontrada" });
      }

      res.status(200).json(obra);
   } catch (error) {
      console.error("Erro ao pesquisar obra:", error);
      res.status(500).json({ error: "Erro ao pesquisar obra" });
   }
};

exports.inserirNovaObra = async (req, res) => {
   const { projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura } = req.body;

   try {
      await sequelize.transaction(async (t) => {
         const obra = await Obra.create(
            { projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura },
            { transaction: t }
         );

         res.status(201).json({ message: "Obra inserida com sucesso!", obra });
      });

   } catch (error) {
      console.error("Erro ao inserir nova obra:", error);
      res.status(500).json({ error: error.message });
   }
};

exports.atualizarObra = async (req, res) => {
   const { id } = req.params;
   const { projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura } = req.body;

   try {
      const obra = await Obra.findByPk(id);

      if (!obra) {
         return res.status(404).json({ error: "Obra não encontrada" });
      }

      await obra.update({ projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura });

      res.status(200).json({ message: "Obra atualizada com sucesso!", obra });
   } catch (error) {
      console.error("Erro ao atualizar obra:", error);
      res.status(500).json({ error: "Erro ao atualizar obra" });
   }
};

exports.eliminarObras = async (req, res) => {
   try {
      let { ids, id } = req.body;

      if (!ids && id) ids = [id];
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma obra selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Elimina primeiro as encomendas relacionadas
         await sequelize.query(`
            DELETE FROM Encomendas WHERE obraId IN (${ids.join(',')});
         `, { transaction: t });

         // Criação da tabela de histórico se não existir
         await sequelize.query(`
            CREATE TABLE IF NOT EXISTS ObrasEliminadas (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               projetoId INTEGER NOT NULL,
               descricao TEXT NOT NULL,
               data DATE NOT NULL,
               valorProposta DECIMAL(10,2) NOT NULL,
               valorFaturado DECIMAL(10,2) NOT NULL,
               dataUltimaFatura DATE NOT NULL,
               dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
         `, { transaction: t });

         // Copiar os dados para a tabela de histórico
         await sequelize.query(`
            INSERT INTO ObrasEliminadas (projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura)
            SELECT projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura
            FROM Obras
            WHERE id IN (${ids.join(',')});
         `, { transaction: t });

         // Eliminar as obras
         await sequelize.query(`
            DELETE FROM Obras WHERE id IN (${ids.join(',')});
         `, { transaction: t });

         // Recriar a tabela Obras com IDs sequenciais
         await sequelize.query(`
            CREATE TABLE Obras_temp (
               id INTEGER PRIMARY KEY,
               projetoId INTEGER NOT NULL,
               descricao TEXT NOT NULL,
               data DATE NOT NULL,
               valorProposta DECIMAL(10,2) NOT NULL,
               valorFaturado DECIMAL(10,2) NOT NULL,
               dataUltimaFatura DATE NOT NULL
            );
         `, { transaction: t });

         await sequelize.query(`
            INSERT INTO Obras_temp (id, projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura)
            SELECT ROW_NUMBER() OVER () AS id, projetoId, descricao, data, valorProposta, valorFaturado, dataUltimaFatura
            FROM Obras;
         `, { transaction: t });

         // Substituir tabela antiga
         await sequelize.query(`DROP TABLE Obras;`, { transaction: t });
         await sequelize.query(`ALTER TABLE Obras_temp RENAME TO Obras;`, { transaction: t });

         await sequelize.query(`DELETE FROM sqlite_sequence WHERE name='Obras';`, { transaction: t });
      });

      res.status(200).json({ message: "Obras eliminadas com sucesso! IDs resetados." });

   } catch (error) {
      console.error("Erro ao eliminar obras:", error);
      res.status(500).json({ error: "Erro ao eliminar obras" });
   }
};
