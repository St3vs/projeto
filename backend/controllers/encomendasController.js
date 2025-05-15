const sequelize = require('../config/config');
const Encomenda = require('../models/encomendas');

exports.getEncomendas = async (req, res) => {
   try {
      const encomendas = await Encomenda.findAll();
      res.status(200).json(encomendas);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de encomendas' });
   }
};

exports.getEncomendaId = async (req, res) => {
   try {
      const { id } = req.params;
      const encomenda = await Encomenda.findByPk(id);

      if (!encomenda) {
         return res.status(404).json({ error: "Encomenda não encontrada" });
      }

      res.status(200).json(encomenda);
   } catch (error) {
      res.status(500).json({ error: "Erro ao pesquisar encomenda" });
   }
};

exports.inserirNovaEncomenda = async (req, res) => {
   const { fornecedor, contacto, descricaoMaterial, data, previsaoEntrega, valor, observacoes } = req.body;

   try {
      await sequelize.transaction(async (t) => {
         // Inserir a proposta
         const encomenda = await Encomenda.create(
            { fornecedor, contacto, descricaoMaterial, data, previsaoEntrega, valor, observacoes },
            { transaction: t }
         );

         res.status(201).json({ message: "Encomenda inserida com sucesso!", encomenda });
      });

   } catch (error) {
      console.error("Erro ao inserir nova encomenda:", error);
      res.status(500).json({ error: "Erro ao inserir nova encomenda" });
   }
};

exports.atualizarEncomenda = async (req, res) => {
   const { id } = req.params;
   const { fornecedor, contacto, descricaoMaterial, data, previsaoEntrega, valor, observacoes } = req.body;

   try {
      const encomenda = await Encomenda.findByPk(id);

      if (!encomenda) {
         return res.status(404).json({ error: "Encomenda não encontrada" });
      }

      await encomenda.update({ fornecedor, contacto, descricaoMaterial, data, previsaoEntrega, valor, observacoes });

      res.status(200).json({ message: "Encomenda atualizada com sucesso!", encomenda });
   } catch (error) {
      console.error("Erro ao atualizar encomenda:", error);
      res.status(500).json({ error: "Erro ao atualizar encomenda" });
   }
};

exports.eliminarEncomendas = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Se apenas um ID for enviado, convertemos para array
      if (!ids && id) {
         ids = [id];
      }

      // Garantir que `ids` é um array de inteiros e remover valores inválidos
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma encomenda selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Eliminar propostas pelos IDs fornecidos
         await sequelize.query(`DELETE FROM Encomenda WHERE id IN (${ids.join(",")});`, { transaction: t });

         // Criar uma nova tabela temporária sem AUTOINCREMENT
         await sequelize.query(`
            CREATE TABLE Encomenda_temp (
               id INTEGER PRIMARY KEY, 
               fornecedor VARCHAR(255) NOT NULL,
               contacto VARCHAR(255) NOT NULL UNIQUE,
               descricaoMaterial VARCHAR(255) NOT NULL,
               data DATETIME NOT NULL,
               previsaoEntrega DATETIME NOT NULL,
               valor VARCHAR(255) NOT NULL,
               observacoes VARCHAR(255),
            );
         `, { transaction: t });

         // Copia os dados para a tabela temporária e reordenar os IDs
         await sequelize.query(`
            INSERT INTO Encomenda_temp (id, fornecedor, contacto, descricaoMaterial, data, previsaoEntrega, valor, observacoes)
            SELECT ROW_NUMBER() OVER (ORDER BY id) AS id, fornecedor, contacto, descricaoMaterial, data, previsaoEntrega, valor, observacoes FROM Encomenda;
         `, { transaction: t });

         // Excluir a tabela original
         await sequelize.query("DROP TABLE Encomenda;", { transaction: t });

         // Renomear a tabela temporária para o nome original
         await sequelize.query("ALTER TABLE Encomenda_temp RENAME TO Encomenda;", { transaction: t });

         // Reseta o AUTOINCREMENT
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Encomendas';", { transaction: t });
      });

      res.status(200).json({ message: "Encomendas eliminadas e IDs resetados com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar encomendas:", error);
      res.status(500).json({ error: "Erro ao eliminar encomendas" });
   }
};
