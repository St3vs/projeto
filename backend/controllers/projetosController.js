const { Projeto, Propostas, Clientes, sequelize } = require('../models');

exports.getProjetos = async (req, res) => {
   try {
      const projetos = await Projeto.findAll({
      include: [
            { model: Clientes, as: 'cliente' },
         ]
      });
      res.status(200).json(projetos);
   } catch (error) {
      res.status(500).json({ error: "Erro ao obter lista de projetos" });
   }
};

exports.eliminarProjetos = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Se apenas um ID for enviado, convertemos para array
      if (!ids && id) {
         ids = [id];
      }

      // Garantir que `ids` é um array de inteiros e remover valores inválidos
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhum projeto selecionado para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Depois elimina as obras
         await Projeto.destroy({
         where: { id: ids },
         transaction: t
         });

         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Projetos';", { transaction: t });
      });

      await sequelize.transaction(async (t) => {
         // Cria a tabela ProjetosEliminados caso não exista
         await sequelize.query(`
            CREATE TABLE IF NOT EXISTS ProjetosEliminados (
               id INTEGER PRIMARY KEY AUTOINCREMENT, 
               clienteId INTEGER NOT NULL,
               assunto VARCHAR(255) NOT NULL,
               descricao TEXT NOT NULL,
               dataInicio DATETIME NOT NULL,
               valor DECIMAL(10,2) NOT NULL,
               dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
         `, { transaction: t });

         // Copia os projetos eliminados para a tabela de histórico
         await sequelize.query(`
            INSERT INTO ProjetosEliminados (clienteId, assunto, descricao, dataInicio, valor)
            SELECT clienteId, assunto, descricao, dataInicio, valor
            FROM Projetos WHERE id IN (${ids.join(",")});
         `, { transaction: t });

         await sequelize.query(`
            DELETE FROM Propostas WHERE idProjeto IN (${ids.join(",")});
         `, { transaction: t });

         // Exclui os projetos da tabela original
         await sequelize.query(`DELETE FROM Projetos WHERE id IN (${ids.join(",")});`, { transaction: t });

         // Cria uma tabela temporária sem AUTOINCREMENT
         await sequelize.query(`
            CREATE TABLE Projetos_temp (
               id INTEGER PRIMARY KEY, 
               clienteId INTEGER NOT NULL,
               assunto VARCHAR(255) NOT NULL,
               descricao TEXT NOT NULL,
               dataInicio DATETIME NOT NULL,
               valor DECIMAL(10,2) NOT NULL
            );
         `, { transaction: t });

         // Copia os dados para a tabela temporária e reordenar os IDs
         await sequelize.query(`
            INSERT INTO Projetos_temp (id, clienteId, assunto, descricao, dataInicio, valor)
            SELECT ROW_NUMBER() OVER () AS id, clienteId, assunto, descricao, dataInicio, valor FROM Projetos;
         `, { transaction: t });

         // Exclui a tabela original
         await sequelize.query("DROP TABLE Projetos;", { transaction: t });

         // Renomeia a tabela temporária para o nome original
         await sequelize.query("ALTER TABLE Projetos_temp RENAME TO Projetos;", { transaction: t });

         // Reset do AUTOINCREMENT
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Projetos';", { transaction: t });
      });

      res.status(200).json({ message: "Projetos e propostas eliminados com sucesso! Histórico atualizado." });
   } catch (error) {
      console.error("Erro ao eliminar projetos:", error);
      res.status(500).json({ error: "Erro ao eliminar projetos" });
   }
};
