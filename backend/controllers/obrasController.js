const sequelize = require('../config/config');
const Obra = require('../models/obras');

exports.getObras = async (req, res) => {
   try {
      const obras = await Obra.findAll();
      res.status(200).json(obras);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de obras' });
   }
};

exports.getObraId = async (req, res) => {
   try {
      const { id } = req.params;
      const obra = await Obra.findByPk(id);

      if (!obra) {
         return res.status(404).json({ error: "Obra não encontrada" });
      }

      res.status(200).json(obra);
   } catch (error) {
      res.status(500).json({ error: "Erro ao pesquisar obra" });
   }
};

exports.inserirNovaObra = async (req, res) => {
   const { cliente, contacto, descricao, data, valorProposta, valorFaturado, dataUltimaFatura } = req.body;

   try {
      await sequelize.transaction(async (t) => {
         const obra = await Obra.create(
            { cliente, contacto, descricao, data, valorProposta, valorFaturado, dataUltimaFatura },
            { transaction: t }
         );

         res.status(201).json({ message: "Obra inserida com sucesso!", obra });
      });

   } catch (error) {
      console.error("Erro ao inserir nova obra:", error);
      res.status(500).json({ error: "Erro ao inserir nova obra" });
   }
};

exports.atualizarObra = async (req, res) => {
   const { id } = req.params;
   const { cliente, contacto, descricao, data, valorProposta, valorFaturado, dataUltimaFatura } = req.body;

   try {
      const obra = await Obra.findByPk(id);

      if (!obra) {
         return res.status(404).json({ error: "Obra não encontrada" });
      }

      await obra.update({ cliente, contacto, descricao, data, valorProposta, valorFaturado, dataUltimaFatura });

      res.status(200).json({ message: "Obra atualizada com sucesso!", obra });
   } catch (error) {
      console.error("Erro ao atualizar obra:", error);
      res.status(500).json({ error: "Erro ao atualizar obra" });
   }
};

/*
exports.eliminarObras = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Se apenas um ID for enviado, convertemos para array
      if (!ids && id) {
         ids = [id];
      }

      // Garantir que `ids` é um array de inteiros e remover valores inválidos
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma obra selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Eliminar propostas pelos IDs fornecidos
         await sequelize.query(`DELETE FROM Obra WHERE id IN (${ids.join(",")});`, { transaction: t });

         // Criar uma nova tabela temporária sem AUTOINCREMENT
         await sequelize.query(`
            CREATE TABLE Obra_temp (
               id INTEGER PRIMARY KEY, 
               cliente VARCHAR(255) NOT NULL,
               contacto VARCHAR(255) NOT NULL,
               descricao VARCHAR(255) NOT NULL,
               data DATETIME NOT NULL,
               valorProposta VARCHAR(255) NOT NULL,
               valorFaturado VARCHAR(255) NOT NULL,
               dataUltimaFatura DATETIME NOT NULL
            );
         `, { transaction: t });

         // Copia os dados para a tabela temporária e reordenar os IDs
         await sequelize.query(`
            INSERT INTO Obra_temp (id, cliente, contacto, descricao, data, valorProposta, valorFaturado, dataUltimaFatura)
            SELECT ROW_NUMBER() OVER (ORDER BY id) AS id, cliente, contacto, descricao, data, valorProposta, valorFaturado, dataUltimaFatura FROM Obra;
         `, { transaction: t });

         // Excluir a tabela original
         await sequelize.query("DROP TABLE Obras;", { transaction: t });

         // Renomear a tabela temporária para o nome original
         await sequelize.query("ALTER TABLE Obra_temp RENAME TO Obra;", { transaction: t });

         // Reseta o AUTOINCREMENT
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Obra';", { transaction: t });
      });

      res.status(200).json({ message: "Obras eliminadas e IDs resetados com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar obras:", error);
      res.status(500).json({ error: "Erro ao eliminar obras" });
   }
};
*/

exports.eliminarObras = async (req, res) => {
   try {
      let { ids, id } = req.body;

      if (!ids && id) {
         ids = [id];
      }

      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma obra selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         await Obra.destroy({
            where: { id: ids },
            transaction: t
         });

         // Reset do AUTOINCREMENT (opcional)
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='obras';", { transaction: t });
      });

      res.status(200).json({ message: "Obras eliminadas com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar obras:", error);
      res.status(500).json({ error: "Erro ao eliminar obras" });
   }
};

