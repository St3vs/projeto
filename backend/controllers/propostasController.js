//controllers/propostasController
const { Propostas, Projeto, Clientes, sequelize } = require('../models');


exports.getPropostas = async (req, res) => {
   try {
      const propostas = await Propostas.findAll({
      include: [
            { model: Clientes, as: 'cliente' },
         ]
      });
      res.status(200).json(propostas);
      
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de propostas' });
   }
};

exports.getPropostaId = async (req, res) => {
   try {
      const { id } = req.params;
      const proposta = await Propostas.findByPk(id, {
          include: [{
              model: Clientes,
              as: 'cliente',
              attributes: ['username', 'contacto']
          }]
      });

      if (!proposta) {
         return res.status(404).json({ error: "Proposta não encontrada" });
      }
      res.status(200).json(proposta);

   } catch (error) {
      console.error("Erro ao buscar proposta por ID:", error);
      res.status(500).json({ error: "Erro ao buscar proposta" });
   }
};

exports.inserirNovaProposta = async (req, res) => {
   const { clienteId, assunto, descricao, data, valor, estado } = req.body;

   try {
      await sequelize.transaction(async (t) => {
      const proposta = await Propostas.create(
         { clienteId, assunto, descricao, data, valor, estado },
         { transaction: t }
      );

      if (estado === "Aceite") {
         const projeto = await Projeto.create(
            { clienteId, assunto, descricao, dataInicio: data, valor },
            { transaction: t }
         );
         await proposta.update({ idProjeto: projeto.id }, { transaction: t });
      }
         res.status(201).json({ message: "Proposta inserida com sucesso!", proposta });
      });

   } catch (error) {
      console.error("Erro ao inserir nova proposta:", error);
      res.status(500).json({ error: "Erro ao inserir nova proposta" });
   }
};

exports.atualizarProposta = async (req, res) => {
    const { id } = req.params;
    const { clienteId, assunto, descricao, data, valor, estado } = req.body;
    try {
        const proposta = await Propostas.findByPk(id);
        if (!proposta) {
            return res.status(404).json({ error: "Proposta não encontrada" });
        }
        await proposta.update({ clienteId, assunto, descricao, data, valor, estado });
        res.status(200).json({ message: "Proposta atualizada com sucesso!", proposta });
    } catch (error) {
        console.error("Erro ao atualizar proposta:", error);
        res.status(500).json({ error: "Erro ao atualizar proposta" });
    }
};

exports.eliminarPropostas = async (req, res) => {
   try {
      let { ids, id } = req.body;

      if (!ids && id) ids = [id];
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma proposta selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Cria a tabela de histórico se não existir (ajuste os campos)
         await sequelize.query(`
         CREATE TABLE IF NOT EXISTS PropostasEliminadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clienteId VARCHAR(255) NOT NULL,
            assunto VARCHAR(255) NOT NULL,
            descricao VARCHAR(255) NOT NULL,
            data DATETIME NOT NULL,
            valor VARCHAR(255) NOT NULL,
            estado VARCHAR(255) NOT NULL,
            idProjeto INTEGER,
            dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP
         );
         `, { transaction: t });

         // Copia as propostas que serão eliminadas para histórico
         await sequelize.query(`
         INSERT INTO PropostasEliminadas (clienteId, assunto, descricao, data, valor, estado, idProjeto)
         SELECT clienteId, assunto, descricao, data, valor, estado, idProjeto
         FROM Propostas WHERE id IN (${ids.join(",")});
         `, { transaction: t });

         // Deleta as propostas da tabela original
         await sequelize.query(`
         DELETE FROM Propostas WHERE id IN (${ids.join(",")});
         `, { transaction: t });

         // Cria tabela temporária para reordenar os IDs
         await sequelize.query(`
         CREATE TABLE Propostas_temp (
            id INTEGER PRIMARY KEY,
            clienteId VARCHAR(255) NOT NULL,
            assunto VARCHAR(255) NOT NULL,
            descricao VARCHAR(255) NOT NULL,
            data DATETIME NOT NULL,
            valor VARCHAR(255) NOT NULL,
            estado VARCHAR(255) NOT NULL,
            idProjeto INTEGER
         );
         `, { transaction: t });

         // Insere os dados restantes renumerando os ids com ROW_NUMBER()
         await sequelize.query(`
         INSERT INTO Propostas_temp (id, clienteId, assunto, descricao, data, valor, estado, idProjeto)
         SELECT ROW_NUMBER() OVER () AS id, clienteId, assunto, descricao, data, valor, estado, idProjeto
         FROM Propostas;
         `, { transaction: t });

         // Remove tabela antiga
         await sequelize.query("DROP TABLE Propostas;", { transaction: t });

         // Renomeia a tabela temporária para o nome original
         await sequelize.query("ALTER TABLE Propostas_temp RENAME TO Propostas;", { transaction: t });

         // Reseta o AUTOINCREMENT do SQLite
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Propostas';", { transaction: t });
      });

      res.status(200).json({ message: "Propostas eliminadas com sucesso! IDs resetados." });
   } catch (error) {
      console.error("Erro ao eliminar propostas:", error);
      res.status(500).json({ error: "Erro ao eliminar propostas" });
   }
};

