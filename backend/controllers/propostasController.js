/* controllers/clientesController.js
const Proposta = require('../models/propostas');

exports.inserirNovaProposta = async (req, res) => {
    try {
        const { cliente, contacto, assunto, descricao, data, valor, estado } = req.body;

        // Criar nova proposta
        const proposta = new Proposta({ cliente, contacto, assunto, descricao, data, valor, estado });
        await proposta.save();

        res.status(201).json({ message: 'Proposta inserida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir nova proposta' });
    }
};

exports.getPropostas = async (req, res) => {
    try {
        const propostas = await Proposta.find();
        res.status(200).json(propostas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter lista de propostas' });
    }
};

exports.eliminarPropostas = async (req, res) => {
    try {
        const { ids } = req.body;

        // Verifica se IDs foram fornecidos
        if (!ids || ids.length === 0) {
            return res.status(400).json({ error: "Nenhuma proposta selecionada para exclusão" });
        }

        await Proposta.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "Propostas eliminadas com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao eliminar propostas" });
    }
};
*/

//controllers/propostasController

const sequelize = require('../config/config');
const Proposta = require('../models/propostas');
const Projeto = require('../models/projetos');

exports.getPropostas = async (req, res) => {
   try {
      const propostas = await Proposta.findAll();
      res.status(200).json(propostas);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de propostas' });
   }
};

exports.getPropostaId = async (req, res) => {
   try {
      const { id } = req.params;
      const proposta = await Proposta.findByPk(id);

      if (!proposta) {
         return res.status(404).json({ error: "Proposta não encontrada" });
      }

      res.status(200).json(proposta);
   } catch (error) {
      res.status(500).json({ error: "Erro ao buscar proposta" });
   }
};

exports.inserirNovaProposta = async (req, res) => {
   const { cliente, contacto, assunto, descricao, data, valor, estado } = req.body;

   try {
      await sequelize.transaction(async (t) => {
         // Inserir a proposta
         const proposta = await Proposta.create(
            { cliente, contacto, assunto, descricao, data, valor, estado },
            { transaction: t }
         );

         // Se for aceita, criar um projeto e atualizar a proposta com o idProjeto
         if (estado === "Aceite") {
            const projeto = await Projeto.create(
               { cliente, assunto, descricao, dataInicio: data, valor },
               { transaction: t }
            );

            // Atualizar a proposta com o ID do projeto recém-criado
            await Proposta.update(
               { idProjeto: projeto.id }, // Associar proposta ao projeto
               { where: { id: proposta.id }, transaction: t }
            );
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
   const { cliente, contacto, assunto, descricao, data, valor, estado } = req.body;

   try {
      const proposta = await Proposta.findByPk(id);

      if (!proposta) {
         return res.status(404).json({ error: "Proposta não encontrada" });
      }

      await proposta.update({ cliente, contacto, assunto, descricao, data, valor, estado });

      res.status(200).json({ message: "Proposta atualizada com sucesso!", proposta });
   } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      res.status(500).json({ error: "Erro ao atualizar proposta" });
   }
};

exports.eliminarPropostas = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Se apenas um ID for enviado, convertemos para array
      if (!ids && id) {
         ids = [id];
      }

      // Garantir que `ids` é um array de inteiros e remover valores inválidos
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma proposta selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Eliminar propostas pelos IDs fornecidos
         await sequelize.query(`DELETE FROM Proposta WHERE id IN (${ids.join(",")});`, { transaction: t });

         // Criar uma nova tabela temporária sem AUTOINCREMENT
         await sequelize.query(`
            CREATE TABLE Proposta_temp (
               id INTEGER PRIMARY KEY, 
               cliente VARCHAR(255) NOT NULL,
               contacto VARCHAR(255) NOT NULL UNIQUE,
               assunto VARCHAR(255) NOT NULL,
               descricao VARCHAR(255) NOT NULL,
               data DATETIME NOT NULL,
               valor VARCHAR(255) NOT NULL,
               estado VARCHAR(255) NOT NULL
            );
         `, { transaction: t });

         // Copia os dados para a tabela temporária e reordenar os IDs
         await sequelize.query(`
            INSERT INTO Proposta_temp (id, cliente, contacto, assunto, descricao, data, valor, estado)
            SELECT ROW_NUMBER() OVER (ORDER BY id) AS id, cliente, contacto, assunto, descricao, data, valor, estado FROM Proposta;
         `, { transaction: t });

         // Excluir a tabela original
         await sequelize.query("DROP TABLE Proposta;", { transaction: t });

         // Renomear a tabela temporária para o nome original
         await sequelize.query("ALTER TABLE Proposta_temp RENAME TO Proposta;", { transaction: t });

         // Reseta o AUTOINCREMENT
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Proposta';", { transaction: t });
      });

      res.status(200).json({ message: "Propostas eliminadas e IDs resetados com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar propostas:", error);
      res.status(500).json({ error: "Erro ao eliminar propostas" });
   }
};
